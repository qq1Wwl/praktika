import pg from 'pg'

// По умолчанию тип NUMERIC приходит из PostgreSQL строкой ("500.00").
// Превращаем его в обычное число, чтобы клиент мог считать сумму
pg.types.setTypeParser(1700, (value) => parseFloat(value))

// Пул подключений к базе данных PostgreSQL (адрес берётся из файла .env)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

export default pool
