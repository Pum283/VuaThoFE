import { CUSTOMER_HOME_WHY_ITEMS } from '../../constants/customerHomeWhy'

export function CustomerWhySection() {
  return (
    <section className="customer-home-why" aria-labelledby="customer-home-why-title">
      <h2 id="customer-home-why-title" className="customer-home-why__title">
        Tại sao chọn Vua Thợ?
      </h2>
      <ul className="customer-home-why__list">
        {CUSTOMER_HOME_WHY_ITEMS.map((item) => (
          <li key={item.title} className="customer-home-why__item">
            <h3 className="customer-home-why__item-title">{item.title}</h3>
            <p className="customer-home-why__item-text">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
