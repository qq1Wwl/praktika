// Адрес серверного API (Node.js + Express).
// Должен совпадать с портом PORT в файле server/.env
const API_URL = 'http://localhost:5000'

// Общая функция для запросов к серверу.
// Возвращает данные ответа или выбрасывает ошибку с понятным текстом
export async function request(path, options = {}) {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null')

  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    // Токен нужен серверу, чтобы понять, кто делает запрос
    headers.Authorization = 'Bearer ' + auth.token
  }

  let response
  try {
    response = await fetch(API_URL + path, { ...options, headers })
  } catch {
    throw new Error('Нет связи с сервером. Проверьте, что API запущен')
  }

  // Ответ может быть без тела, поэтому читаем JSON осторожно
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    if (response.status === 401 && !data) {
      throw new Error('Сессия закончилась, войдите в аккаунт заново')
    }
    throw new Error((data && data.message) || 'Ошибка сервера (' + response.status + ')')
  }

  return data
}
