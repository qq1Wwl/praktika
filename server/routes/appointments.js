import { Router } from 'express'
import pool from '../db.js'
import auth from '../middleware/auth.js'

const router = Router()

// Все маршруты этого файла доступны только с JWT-токеном
router.use(auth)

// GET /api/appointments - мои записи
router.get('/', async (req, res) => {
  const result = await pool.query(
    `SELECT a.id,
            s.name AS "serviceName",
            a.quantity,
            to_char(a.appointment_date, 'YYYY-MM-DD') AS date,
            a.status,
            COALESCE(SUM(p.amount), 0) AS amount,
            MIN(p.status) AS "paymentStatus"
     FROM appointments a
     JOIN services s ON s.id = a.service_id
     LEFT JOIN payments p ON p.appointment_id = a.id
     WHERE a.user_id = $1
     GROUP BY a.id, s.name
     ORDER BY a.id DESC`,
    [req.userId]
  )
  res.json(result.rows)
})

// POST /api/appointments - оформить запись из корзины
router.post('/', async (req, res) => {
  const { date, items } = req.body || {}

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Корзина пуста' })
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || isNaN(new Date(date))) {
    return res.status(400).json({ message: 'Укажите дату записи' })
  }
  // Сегодняшняя дата в формате гггг-мм-дд (строки в таком формате сравниваются как даты)
  const today = new Date().toLocaleDateString('sv-SE')
  if (date < today) {
    return res.status(400).json({ message: 'Дата записи не может быть в прошлом' })
  }

  const user = await pool.query('SELECT 1 FROM users WHERE id = $1', [req.userId])
  if (user.rowCount === 0) {
    return res.status(401).json({ message: 'Пользователь не найден, войдите заново' })
  }

  // Загружаем услуги из корзины, чтобы взять цену из базы (а не от клиента)
  const ids = items.map((item) => Number(item.serviceId))
  const found = await pool.query('SELECT id, price FROM services WHERE id = ANY($1)', [ids])
  const prices = new Map(found.rows.map((row) => [row.id, row.price]))

  for (const item of items) {
    if (!prices.has(Number(item.serviceId))) {
      return res.status(400).json({ message: 'Услуга не найдена' })
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      return res.status(400).json({ message: 'Количество должно быть от 1 до 20' })
    }
  }

  // Все записи и платежи сохраняются одной транзакцией
  const client = await pool.connect()
  let total = 0
  try {
    await client.query('BEGIN')

    for (const item of items) {
      const amount = prices.get(Number(item.serviceId)) * item.quantity
      total += amount

      const appointment = await client.query(
        `INSERT INTO appointments (user_id, service_id, quantity, appointment_date, status)
         VALUES ($1, $2, $3, $4, 'new')
         RETURNING id`,
        [req.userId, item.serviceId, item.quantity, date]
      )

      // К каждой записи создаётся платёж (оплата имитируется)
      await client.query(
        `INSERT INTO payments (appointment_id, amount, method, status)
         VALUES ($1, $2, 'card', 'paid')`,
        [appointment.rows[0].id, amount]
      )
    }

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }

  res.json({ message: 'Запись оформлена', total })
})

export default router
