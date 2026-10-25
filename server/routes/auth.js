import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db.js'

const router = Router()

// Создаёт JWT-токен и ответ для клиента
function createAuthResponse(user, role) {
  const token = jwt.sign(
    { userId: user.id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  return { token, user: { id: user.id, email: user.email, role } }
}

// Общая проверка данных формы. Возвращает текст ошибки или null
function checkBody(email, password, checkFormat) {
  if (!email || !password) {
    return 'Заполните почту и пароль'
  }
  if (checkFormat) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return 'Введите корректную почту'
    }
    if (password.length < 6) {
      return 'Пароль должен быть не короче 6 символов'
    }
  }
  return null
}

// POST /api/auth/register - регистрация
router.post('/register', async (req, res) => {
  const body = req.body || {}
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const error = checkBody(email, password, true)
  if (error) {
    return res.status(400).json({ message: error })
  }

  const exists = await pool.query('SELECT 1 FROM users WHERE email = $1', [email])
  if (exists.rowCount > 0) {
    return res.status(409).json({ message: 'Пользователь с такой почтой уже существует' })
  }

  // Новый пользователь получает роль client.
  // Пароль хранится только в виде хеша
  const passwordHash = await bcrypt.hash(password, 10)
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, role_id)
     VALUES ($1, $2, (SELECT id FROM roles WHERE name = 'client'))
     RETURNING id, email`,
    [email, passwordHash]
  )

  res.json(createAuthResponse(result.rows[0], 'client'))
})

// POST /api/auth/login - вход
router.post('/login', async (req, res) => {
  const body = req.body || {}
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const error = checkBody(email, password, false)
  if (error) {
    return res.status(400).json({ message: error })
  }

  const result = await pool.query(
    `SELECT u.id, u.email, u.password_hash, r.name AS role
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.email = $1`,
    [email]
  )
  const user = result.rows[0]

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Неверная почта или пароль' })
  }

  res.json(createAuthResponse(user, user.role))
})

export default router
