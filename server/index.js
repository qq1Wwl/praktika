import express from 'express'
import cors from 'cors'
import servicesRouter from './routes/services.js'
import authRouter from './routes/auth.js'
import appointmentsRouter from './routes/appointments.js'

const app = express()

// Разрешаем запросы от React-приложения (оно запускается на порту 5173)
app.use(cors({ origin: 'http://localhost:5173' }))
// Тело запроса в формате JSON попадает в req.body
app.use(express.json())

// Маршруты API
app.use('/api/services', servicesRouter)
app.use('/api/auth', authRouter)
app.use('/api/appointments', appointmentsRouter)

// Обработка непредвиденных ошибок (например, база данных недоступна)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Ошибка сервера. Проверьте подключение к базе данных' })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('API запущен: http://localhost:' + port)
})
