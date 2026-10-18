// Картинки товаров лежат в папке src/assets
import headphones from '../assets/headphones.svg'
import watch from '../assets/watch.svg'
import backpack from '../assets/backpack.svg'
import sneaker from '../assets/sneaker.svg'
import camera from '../assets/camera.svg'
import laptop from '../assets/laptop.svg'

// Список товаров каталога
const products = [
  { id: 1, name: 'Наушники', price: 4990, image: headphones },
  { id: 2, name: 'Умные часы', price: 8990, image: watch },
  { id: 3, name: 'Рюкзак', price: 3290, image: backpack },
  { id: 4, name: 'Кроссовки', price: 6490, image: sneaker },
  { id: 5, name: 'Фотоаппарат', price: 25990, image: camera },
  { id: 6, name: 'Ноутбук', price: 59990, image: laptop },
]

export default products
