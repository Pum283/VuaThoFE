import { Link } from 'react-router-dom'
import { CUSTOMER_HOME_CATEGORIES } from '../constants/customerHomeCategories'
import { CategoryIcon } from '../components/customer-home/CategoryIcon'
import { CustomerHomeHeader } from '../components/customer-home/CustomerHomeHeader'
import { CustomerWhySection } from '../components/customer-home/CustomerWhySection'
import '../customer-home.css'

function formatWorkerCount(count: number) {
  return `${count} thợ`
}

export function HomePage() {
  return (
    <div className="customer-home">
      <CustomerHomeHeader />

      <main className="customer-home-main">
        <section id="danh-muc" aria-labelledby="customer-home-categories-title">
          <h1 id="customer-home-categories-title" className="customer-home-hero-title">
            Danh mục ngành nghề
          </h1>
          <p className="customer-home-hero-sub">Chọn ngành nghề bạn cần</p>

          <div className="customer-home-grid">
            {CUSTOMER_HOME_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={{ pathname: '/home', search: `?danhMuc=${encodeURIComponent(cat.id)}` }}
                className="customer-home-card"
              >
                <span className="customer-home-card__icon-wrap">
                  <CategoryIcon iconId={cat.iconId} />
                </span>
                <h2 className="customer-home-card__title">{cat.title}</h2>
                <p className="customer-home-card__count">{formatWorkerCount(cat.workerCount)}</p>
              </Link>
            ))}
          </div>
        </section>

        <CustomerWhySection />
      </main>
    </div>
  )
}
