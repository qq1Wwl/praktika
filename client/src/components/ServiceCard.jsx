function ServiceCard({ service, onAdd }) {
  return (
    <div className="service">
      <h3>{service.name}</h3>
      <p className="description">{service.description}</p>
      <p className="duration">⏱ {service.durationMinutes} мин</p>
      <p className="price">{service.price} ₽</p>
      <button className="btn" onClick={() => onAdd(service)}>
        В корзину
      </button>
    </div>
  )
}

export default ServiceCard
