import { SERVICES } from '../data/services'

export default function CostSummary({ selected }) {
  const selectedServices = selected.map(id => SERVICES.find(s => s.id === id)).filter(Boolean)
  const monthly = selectedServices.reduce((sum, s) => sum + s.price, 0)
  const yearly = monthly * 12

  const avgMonthly = 61
  const overpaying = Math.max(0, monthly - avgMonthly)

  return (
    <section className="cost-summary">
      <div className="cost-cards">
        <div className="cost-card cost-card-main">
          <div className="cost-label">you're paying</div>
          <div className="cost-amount">${monthly.toFixed(2)}</div>
          <div className="cost-sublabel">every month</div>
        </div>
        <div className="cost-card">
          <div className="cost-label">that's</div>
          <div className="cost-amount cost-amount-sm">${yearly.toFixed(2)}</div>
          <div className="cost-sublabel">per year on streaming</div>
        </div>
        <div className={`cost-card ${overpaying > 0 ? 'cost-card-warning' : 'cost-card-good'}`}>
          <div className="cost-label">vs. the average person</div>
          <div className="cost-amount cost-amount-sm">
            {overpaying > 0 ? `$${overpaying.toFixed(2)} more` : `$${Math.abs(monthly - avgMonthly).toFixed(2)} less`}
          </div>
          <div className="cost-sublabel">
            {overpaying > 0 ? 'the average is $61/mo' : 'nice — average is $61/mo'}
          </div>
        </div>
      </div>

      <div className="service-breakdown">
        <h3>here's the breakdown</h3>
        <div className="breakdown-list">
          {selectedServices.map(service => (
            <div key={service.id} className="breakdown-item">
              <span className="breakdown-dot" style={{ background: service.color }} />
              <span className="breakdown-name">
                {service.name}{service.tier ? ` — ${service.tier}` : ''}
              </span>
              <span className="breakdown-price">${service.price.toFixed(2)}/mo</span>
            </div>
          ))}
          <div className="breakdown-item breakdown-total">
            <span className="breakdown-dot" style={{ background: 'transparent' }} />
            <span className="breakdown-name"><strong>total</strong></span>
            <span className="breakdown-price"><strong>${monthly.toFixed(2)}/mo</strong></span>
          </div>
        </div>
      </div>
    </section>
  )
}
