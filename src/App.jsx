import ProductCard from './components/ProductCard'
import headphones from './assets/headphones.svg'
import watch from './assets/watch.svg'
import backpack from './assets/backpack.svg'
import sneaker from './assets/sneaker.svg'
import camera from './assets/camera.svg'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1 className="title">Мой магазин</h1>

      <div className="cards">
        <ProductCard name="Наушники" price={4990} image={headphones} />
        <ProductCard name="Умные часы" price={8990} image={watch} />
        <ProductCard name="Рюкзак" price={3290} image={backpack} />
        <ProductCard name="Кроссовки" price={6490} image={sneaker} />
        <ProductCard name="Фотоаппарат" price={25990} image={camera} />
      </div>
    </div>
  )
}

export default App
