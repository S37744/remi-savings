import { SERVICES } from '../data/services'

function getTips(selected, selectedServices) {
  const tips = []

  // Check for ad-supported tier upgrades that might not be worth it
  const premiumNetflix = selected.includes('netflix-premium')
  const standardNetflix = selected.includes('netflix-standard')
  if (premiumNetflix) {
    tips.push({
      icon: '📺',
      title: 'Switch Netflix to Standard',
      detail: 'Netflix Premium costs $22.99/mo. Standard ($15.49) gives you the same content — you only lose one extra screen. Save $7.50/mo.',
      saving: 7.50,
    })
  }

  // Check for Hulu no-ads when Disney bundle with ads is cheaper
  const huluNoAds = selected.includes('hulu-no-ads')
  const disneyAds = selected.includes('disney-ads')
  const espnPlus = selected.includes('espn-plus')
  if (huluNoAds && !disneyAds && !espnPlus) {
    tips.push({
      icon: '📦',
      title: 'Consider the Disney Bundle',
      detail: 'Hulu No Ads alone is $17.99. The Disney Bundle (Disney+ + Hulu with ads + ESPN+) is $14.99. You save $3/mo and get 2 more services.',
      saving: 3.00,
    })
  }

  // Multiple overlapping services
  const hasMax = selected.some(id => id.startsWith('max-'))
  const hasHulu = selected.some(id => id.startsWith('hulu-'))
  const hasParamount = selected.some(id => id.startsWith('paramount-'))
  if (hasMax && hasHulu && hasParamount) {
    tips.push({
      icon: '🔁',
      title: 'You have 3 similar services',
      detail: 'Max, Hulu, and Paramount+ all carry similar content. Consider rotating — subscribe to one for a month to finish your shows, then switch.',
      saving: null,
    })
  }

  // Apple TV+ tip
  if (selected.includes('apple-tv')) {
    tips.push({
      icon: '🍎',
      title: 'Apple TV+ may be free for you',
      detail: 'Apple TV+ is included free for 3 months with any new Apple device purchase. Check if your device qualifies at apple.com/tv.',
      saving: 9.99,
    })
  }

  // YouTube Premium tip
  if (selected.includes('youtube-premium')) {
    tips.push({
      icon: '▶️',
      title: 'YouTube Premium Family Plan',
      detail: 'If you have family members who also use YouTube, the Family Plan ($22.99/mo) covers up to 5 people — splitting it saves everyone money.',
      saving: null,
    })
  }

  // Discovery+ tip
  if (selected.some(id => id.startsWith('discovery-')) && hasMax) {
    tips.push({
      icon: '🔭',
      title: 'Discovery+ is included in Max Ultimate',
      detail: 'Max Ultimate ($19.99/mo) includes Discovery+ content. If you upgraded to Max Ultimate, you could cancel Discovery+ separately.',
      saving: selected.includes('discovery-premium') ? 8.99 : 4.99,
    })
  }

  return tips
}

export default function SavingsReport({ selected }) {
  const selectedServices = selected.map(id => SERVICES.find(s => s.id === id)).filter(Boolean)
  const tips = getTips(selected, selectedServices)

  const totalMonthlySavings = tips
    .filter(t => t.saving !== null)
    .reduce((sum, t) => sum + t.saving, 0)

  return (
    <section className="savings-report">
      <h3 className="section-title-sm">🎯 Personalized Saving Tips</h3>

      {tips.length === 0 ? (
        <div className="no-tips">
          <p>✅ Your Current Streaming Setup Looks Pretty Optimized! No Major Savings Found.</p>
        </div>
      ) : (
        <>
          {totalMonthlySavings > 0 && (
            <div className="savings-banner">
              You Could Save Up to <strong>${totalMonthlySavings.toFixed(2)}/mo</strong> · <strong>${(totalMonthlySavings * 12).toFixed(2)}/year</strong> With These Changes
            </div>
          )}

          <div className="tips-list">
            {tips.map((tip, i) => (
              <div key={i} className="tip-card">
                <div className="tip-icon">{tip.icon}</div>
                <div className="tip-content">
                  <div className="tip-title">{tip.title}</div>
                  <div className="tip-detail">{tip.detail}</div>
                </div>
                {tip.saving !== null && (
                  <div className="tip-saving">
                    <span className="saving-amount">-${tip.saving.toFixed(2)}</span>
                    <span className="saving-label">per month</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="share-prompt">
        <p>💬 Know Someone Paying Too Much for Streaming?</p>
        <button
          className="btn-share"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Remi Savings — Am I Overpaying on Streaming?',
                text: 'Check if you\'re overpaying on streaming subscriptions',
                url: window.location.href,
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('Link copied to clipboard!')
            }
          }}
        >
          Share Remi Savings
        </button>
      </div>
    </section>
  )
}
