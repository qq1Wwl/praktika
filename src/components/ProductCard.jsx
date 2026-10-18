function ProductCard({ product, onAdd }) {
  return (
    <div className="product">
      <img className="product-image" src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">{product.price} ₽</p>
      <button className="btn" onClick={() => onAdd(product)}>
        В корзину
      </button>
    </div>
  )
}

export default ProductCard
