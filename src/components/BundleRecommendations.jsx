import { SERVICES, BUNDLES } from '../data/services'

export default function BundleRecommendations({ selected }) {
  const applicableBundles = BUNDLES.filter(bundle => {
    const overlap = bundle.includes.filter(id => selected.includes(id))
    return overlap.length >= 2
  })

  if (applicableBundles.length === 0) return null

  return (
    <section className="bundles">
      <h3 className="section-title-sm">💡 Bundle Deals You're Missing</h3>
      <p className="section-subtitle">You're paying for these separately — bundle them and save.</p>

      <div className="bundle-cards">
        {applicableBundles.map(bundle => {
          const currentCost = bundle.includes.reduce((sum, id) => {
            const service = SERVICES.find(s => s.id === id)
            return sum + (selected.includes(id) && service ? service.price : 0)
          }, 0)
          const savings = currentCost - bundle.price

          return (
            <div key={bundle.id} className={`bundle-card ${bundle.highlight ? 'bundle-highlight' : ''}`}>
              {bundle.highlight && <div className="bundle-badge">Best Deal</div>}
              <div className="bundle-name">{bundle.name}</div>
              <div className="bundle-desc">{bundle.description}</div>

              <div className="bundle-pricing">
                <div className="bundle-current">
                  <span className="pricing-label">You pay now</span>
                  <span className="pricing-value strikethrough">${currentCost.toFixed(2)}/mo</span>
                </div>
                <div className="bundle-arrow">→</div>
                <div className="bundle-new">
                  <span className="pricing-label">Bundle price</span>
                  <span className="pricing-value pricing-green">${bundle.price.toFixed(2)}/mo</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="bundle-savings">
                  Save <strong>${savings.toFixed(2)}/mo</strong> · <strong>${(savings * 12).toFixed(2)}/year</strong>
                </div>
              )}

              <a
                href="https://www.disneyplus.com/welcome/disney-hulu-espn-bundle"
                target="_blank"
                rel="noopener noreferrer"
                className="bundle-cta"
              >
                Get This Bundle →
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}
