import { SERVICES } from '../data/services'

function getTips(selected) {
  const tips = []

  const has = (id) => selected.includes(id)
  const hasAny = (...ids) => ids.some(id => selected.includes(id))
  const hasAll = (...ids) => ids.every(id => selected.includes(id))

  // Netflix Premium → Standard
  if (has('netflix-premium')) {
    tips.push({
      icon: '📺',
      title: 'Downgrade Netflix to Standard and Save $7/mo',
      detail: 'Netflix Premium ($24.99) and Standard ($17.99) have the exact same shows and movies. The only difference is Premium lets you stream on 4 screens at once instead of 2, and adds 4K. If you\'re not using 4 screens, you\'re paying $7/mo for nothing.',
      saving: 7.00,
    })
  }

  // Netflix Standard → Ads
  if (has('netflix-standard')) {
    tips.push({
      icon: '💡',
      title: 'Netflix With Ads Is Only $7.99/mo — Same Shows',
      detail: 'The ad-supported Netflix plan ($7.99) has nearly all the same content as Standard ($17.99). You\'ll see a few short ads per hour, but you save $10/mo — that\'s $120/year. Most people barely notice the ads.',
      saving: 10.00,
    })
  }

  // Has Disney+ + Hulu + ESPN separately
  if (hasAll('disney-ads', 'hulu-ads', 'espn') || hasAll('disney-premium', 'hulu-no-ads', 'espn')) {
    const saving = has('disney-ads') ? (11.99 + 11.99 + 29.99) - 20.00 : (18.99 + 18.99 + 29.99) - 30.00
    tips.push({
      icon: '📦',
      title: 'You\'re Already Paying for the Disney Bundle — Just Get the Bundle',
      detail: `You pay for Disney+, Hulu, and ESPN separately. Disney offers all three as a bundle for ${has('disney-ads') ? '$20/mo' : '$30/mo'}. You get the exact same access — just combined into one subscription. No content changes at all.`,
      saving,
    })
  }

  // Has Hulu but not Disney bundle
  if (has('hulu-no-ads') && !has('disney-ads') && !has('espn')) {
    tips.push({
      icon: '📦',
      title: 'Switch to Disney Bundle and Get 2 Extra Services for Less',
      detail: 'Hulu No Ads alone is $18.99/mo. The Disney Bundle with Hulu (with ads) + Disney+ + ESPN is just $20/mo — that\'s only $1 more and you get Disney+ and ESPN+ included. If you can live with a few ads on Hulu, it\'s a no-brainer.',
      saving: null,
    })
  }

  // Max + Hulu overlap
  if (hasAny('max-ads', 'max-ad-free', 'max-ultimate') && hasAny('hulu-ads', 'hulu-no-ads')) {
    tips.push({
      icon: '🔁',
      title: 'Max and Hulu Have a Lot of Overlap — Consider Rotating',
      detail: 'Both Max and Hulu carry a massive library of TV shows and movies. Instead of paying for both every month, try watching everything you want on Max for a month, then cancel and switch to Hulu. You save ~$10-18/mo and never run out of things to watch.',
      saving: null,
    })
  }

  // Netflix + Max overlap
  if (hasAny('netflix-ads', 'netflix-standard', 'netflix-premium') && hasAny('max-ads', 'max-ad-free', 'max-ultimate')) {
    tips.push({
      icon: '🔁',
      title: 'Netflix and Max Are Both Premium Drama Services — Rotate Them',
      detail: 'Netflix and Max are the two biggest prestige TV platforms. Most people binge one service\'s shows, then run out of things to watch anyway. Cancel one, finish everything on the other, then switch. You\'ll only pay for one at a time and save $10-22/mo.',
      saving: null,
    })
  }

  // Has Paramount+ and Max or Hulu
  if (hasAny('paramount-ads', 'paramount-premium') && hasAny('max-ads', 'max-ad-free', 'max-ultimate', 'hulu-ads', 'hulu-no-ads')) {
    tips.push({
      icon: '📡',
      title: 'Paramount+ Overlaps With Your Other Services',
      detail: 'Paramount+ has CBS shows, Showtime originals, and some movies. A lot of that content ends up on Max or Hulu later anyway. If you\'re not watching Paramount+ daily, pause it for a month and see if you miss it — most people don\'t.',
      saving: has('paramount-premium') ? 13.99 : 8.99,
    })
  }

  // Apple TV+ tip
  if (has('apple-tv')) {
    tips.push({
      icon: '🍎',
      title: 'Apple TV+ May Already Be Free for You',
      detail: 'Apple gives 3 months of Apple TV+ free with any new iPhone, iPad, Mac, or Apple TV purchase. If you bought an Apple device in the last few months and haven\'t claimed it, check apple.com/tv-app/offer — you could be paying for something you already have for free.',
      saving: 12.99,
    })
  }

  // YouTube Premium - suggest family plan
  if (has('youtube-premium')) {
    tips.push({
      icon: '▶️',
      title: 'Split YouTube Premium With Family and Pay $3-4/mo Each',
      detail: 'YouTube Premium Individual is $15.99/mo. The Family Plan is $22.99/mo and covers up to 5 people. If you split it with 2 family members or friends, each person pays under $8. Split 5 ways and it\'s only $4.60 each — that\'s $11/mo back in your pocket.',
      saving: null,
    })
  }

  // Discovery+ with Max
  if (hasAny('discovery-ads', 'discovery-premium') && hasAny('max-ads', 'max-ad-free', 'max-ultimate')) {
    tips.push({
      icon: '🔭',
      title: 'Discovery+ Content Is Already Inside Max — You\'re Double Paying',
      detail: 'Max includes a huge library of Discovery content — nature documentaries, cooking shows, home improvement, reality TV. Most of what\'s on Discovery+ is available directly in Max. You\'re likely paying for the same shows twice. Cancel Discovery+ and check Max first.',
      saving: has('discovery-premium') ? 9.99 : 5.99,
    })
  }

  // Peacock + Paramount overlap
  if (hasAny('peacock-select', 'peacock-ads', 'peacock-premium') && hasAny('paramount-ads', 'paramount-premium')) {
    tips.push({
      icon: '📡',
      title: 'Peacock and Paramount+ Have Similar Content — Pick One',
      detail: 'Both Peacock (NBC/Universal) and Paramount+ (CBS/Showtime) are mid-tier services with similar price points and overlapping content like reality TV, procedural dramas, and live sports. Unless you have a specific show you\'re watching on each, consider dropping one and saving $8-14/mo.',
      saving: null,
    })
  }

  // Has ESPN standalone
  if (has('espn')) {
    tips.push({
      icon: '🏈',
      title: 'ESPN Is $29.99/mo — Make Sure You\'re Using It Enough',
      detail: 'ESPN Unlimited is one of the priciest streaming services. If you\'re only watching one sport or a few games a month, it might not be worth it. Consider pausing during the off-season of your main sport and resubscribing when the season starts — you\'ll only pay for the months you actually use it.',
      saving: null,
    })
  }

  // Has 4+ services total
  if (selected.length >= 4) {
    tips.push({
      icon: '📅',
      title: 'With 4+ Services, Try the \'One at a Time\' Strategy',
      detail: 'Most streaming services let you cancel and resubscribe anytime with no penalty. Pick your favorite right now, watch everything you want, then cancel and move to the next one. Rotating through services one month at a time means you only ever pay for one — saving you hundreds per year.',
      saving: null,
    })
  }

  return tips
}

export default function SavingsReport({ selected }) {
  const tips = getTips(selected)

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
                    <span className="saving-label">Per Month</span>
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
              alert('Link Copied to Clipboard!')
            }
          }}
        >
          Share Remi Savings
        </button>
      </div>
    </section>
  )
}
