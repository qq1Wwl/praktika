import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
      <h1>404 - страница не найдена</h1>
      <Link to="/">Вернуться в каталог</Link>
    </div>
  )
}

export default NotFound
