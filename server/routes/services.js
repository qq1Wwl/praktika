import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/services - список всех услуг
router.get('/', async (req, res) => {
  const result = await pool.query(
    `SELECT id,
            name,
            description,
            duration_minutes AS "durationMinutes",
            price
     FROM services
     ORDER BY id`
  )
  res.json(result.rows)
})

export default router
