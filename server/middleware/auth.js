import jwt from 'jsonwebtoken'

// Проверка JWT-токена (для маршрутов, доступных после входа)
export default function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Сессия закончилась, войдите в аккаунт заново' })
  }

  try {
    // Из токена берём id пользователя, который делает запрос
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ message: 'Сессия закончилась, войдите в аккаунт заново' })
  }
}
