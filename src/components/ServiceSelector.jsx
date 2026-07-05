import { SERVICES } from '../data/services'

const SERVICE_GROUPS = [
  { name: 'Netflix', ids: ['netflix-ads', 'netflix-standard', 'netflix-premium'] },
  { name: 'Hulu', ids: ['hulu-ads', 'hulu-no-ads'] },
  { name: 'Disney+', ids: ['disney-ads', 'disney-premium'] },
  { name: 'Max', ids: ['max-ads', 'max-ad-free', 'max-ultimate'] },
  { name: 'Apple TV+', ids: ['apple-tv'] },
  { name: 'Peacock', ids: ['peacock-ads', 'peacock-premium'] },
  { name: 'Paramount+', ids: ['paramount-ads', 'paramount-premium'] },
  { name: 'ESPN+', ids: ['espn-plus'] },
  { name: 'Prime Video', ids: ['amazon-prime-video'] },
  { name: 'YouTube Premium', ids: ['youtube-premium'] },
  { name: 'Discovery+', ids: ['discovery-ads', 'discovery-premium'] },
]

export default function ServiceSelector({ selected, onToggle }) {
  return (
    <section className="service-selector">
      <h2 className="section-title">Select Your Streaming Services</h2>
      <p className="section-subtitle">Pick every service you currently pay for</p>

      <div className="service-groups">
        {SERVICE_GROUPS.map(group => {
          const services = group.ids.map(id => SERVICES.find(s => s.id === id)).filter(Boolean)
          const activeInGroup = services.filter(s => selected.includes(s.id))
          const isGroupActive = activeInGroup.length > 0

          return (
            <div key={group.name} className={`service-group ${isGroupActive ? 'active' : ''}`}>
              <div className="service-group-header">
                <span className="service-logo">{services[0].logo}</span>
                <span className="service-name">{group.name}</span>
              </div>
              <div className="service-tiers">
                {services.map(service => {
                  const isSelected = selected.includes(service.id)
                  return (
                    <button
                      key={service.id}
                      className={`tier-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => onToggle(service.id)}
                      style={isSelected ? { borderColor: service.color, backgroundColor: service.color + '22' } : {}}
                    >
                      <span className="tier-name">{service.tier || 'Standard'}</span>
                      <span className="tier-price">${service.price.toFixed(2)}/mo</span>
                      {isSelected && <span className="tier-check">✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
