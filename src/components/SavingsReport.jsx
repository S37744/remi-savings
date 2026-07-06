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
      detail: 'Netflix Premium ($24.99) and Standard ($17.99) have 100% the same shows, movies, and new releases — zero content difference. Premium only adds two things: streaming on 4 screens simultaneously instead of 2, and 4K video. If you\'re not streaming on 4 devices at once or you don\'t have a 4K TV, you\'re paying $7/mo for features you\'re not using. Go to your Netflix account settings, click Change Plan, and switch to Standard in under a minute. Your watchlist, recommendations, and every show stays exactly the same.',
      saving: 7.00,
    })
  }

  // Netflix Standard → Ads
  if (has('netflix-standard')) {
    tips.push({
      icon: '💡',
      title: 'Netflix With Ads Is Only $7.99/mo — Same Shows',
      detail: 'The Netflix With Ads plan ($7.99) has nearly all the same shows and movies as Standard ($17.99) — the content difference is minimal, maybe 5% of titles missing due to licensing, and those are rarely the popular ones. You\'ll see about 4-5 minutes of ads per hour, similar to regular TV. You save $10/mo — $120/year — for a very minor change in experience. Most people forget they even switched after the first week. You can always switch back if you hate it, but most don\'t.',
      saving: 10.00,
    })
  }

  // Has Disney+ + Hulu + ESPN separately
  if (hasAll('disney-ads', 'hulu-ads', 'espn') || hasAll('disney-premium', 'hulu-no-ads', 'espn')) {
    const saving = has('disney-ads') ? (11.99 + 11.99 + 29.99) - 20.00 : (18.99 + 18.99 + 29.99) - 30.00
    tips.push({
      icon: '📦',
      title: 'You\'re Already Paying for the Disney Bundle — Just Get the Bundle',
      detail: `You're currently paying for Disney+, Hulu, and ESPN as three separate charges. Disney literally sells all three together as one bundle — same apps, same logins, same content — for ${has('disney-ads') ? '$20/mo' : '$30/mo'} total. Nothing changes about what you watch or how you watch it. You just get one charge instead of three and pay less. Go to disneyplus.com/bundle and switch today — it takes about two minutes.`,
      saving,
    })
  }

  // Has Hulu but not Disney bundle
  if (has('hulu-no-ads') && !has('disney-ads') && !has('espn')) {
    tips.push({
      icon: '📦',
      title: 'Switch to Disney Bundle and Get 2 Extra Services for $1 More',
      detail: 'You\'re paying $18.99/mo for Hulu alone. For just $1 more ($20/mo), the Disney Bundle gives you Hulu with ads, Disney+ with every Marvel movie, all of Pixar, Star Wars, and National Geographic, plus ESPN+ with live sports and fight cards. Disney+ alone normally costs $11.99/mo and ESPN+ costs $10.99/mo — you\'d be getting both added to your Hulu for literally one extra dollar per month. The only trade-off is switching from Hulu No Ads to Hulu With Ads. If you can live with a few short ads, it\'s a no-brainer. Go to disneyplus.com/bundle to switch.',
      saving: null,
    })
  }

  // Max + Hulu overlap
  if (hasAny('max-ads', 'max-ad-free', 'max-ultimate') && hasAny('hulu-ads', 'hulu-no-ads')) {
    tips.push({
      icon: '🔁',
      title: 'Max and Hulu Have Thousands of Shows Each — You Only Need One at a Time',
      detail: 'Max has The Sopranos, Game of Thrones, Succession, House of the Dragon, The White Lotus, and every HBO original ever made. Hulu has The Bear, Shogun, Abbott Elementary, It\'s Always Sunny, and every current-season ABC, NBC, and FX show. Both libraries are so massive that most people finish everything they want to watch in 2-3 months then let it sit idle. Spend a month burning through your Max watchlist, cancel, switch to Hulu, burn through that, then switch back. You\'ll never run out of things to watch and you\'ll save $10-18/mo every month you\'re only paying for one.',
      saving: null,
    })
  }

  // Netflix + Max overlap
  if (hasAny('netflix-ads', 'netflix-standard', 'netflix-premium') && hasAny('max-ads', 'max-ad-free', 'max-ultimate')) {
    tips.push({
      icon: '🔁',
      title: 'Netflix and Max Are Both Enormous — Rotate and Save $10-22/mo',
      detail: 'Netflix has Stranger Things, Wednesday, Bridgerton, Squid Game, Ozark, and thousands of movies and originals. Max has The Sopranos, Succession, The White Lotus, every HBO series ever made, and Warner Bros. movies. Both are massive libraries — no one actively watches both in the same week. When\'s the last time you watched something on both services in the same week? Pick the one with the show you\'re currently watching, cancel the other, then swap when you finish. You\'ll save $10-22/mo every month and your watch list will never get shorter.',
      saving: null,
    })
  }

  // Has Paramount+ and Max or Hulu
  if (hasAny('paramount-ads', 'paramount-premium') && hasAny('max-ads', 'max-ad-free', 'max-ultimate', 'hulu-ads', 'hulu-no-ads')) {
    tips.push({
      icon: '📡',
      title: 'Most of What\'s on Paramount+ Is Already on Max or Hulu',
      detail: 'Paramount+ carries CBS procedurals like NCIS and FBI, Showtime originals like Yellowjackets and Billions, and Paramount movies. The catch: Showtime content eventually moves to Max, and current CBS shows end up on Hulu. If you already pay for Max or Hulu, you can get most of what you watch on Paramount+ through those services — either now or within a few months of it airing. Cancel Paramount+ for one month and see what you actually miss. If the answer is nothing, you just saved $8.99-$13.99 permanently.',
      saving: has('paramount-premium') ? 13.99 : 8.99,
    })
  }

  // Apple TV+ tip
  if (has('apple-tv')) {
    const hasNetflixOrMax = hasAny('netflix-ads', 'netflix-standard', 'netflix-premium', 'max-ads', 'max-ad-free', 'max-ultimate')
    tips.push({
      icon: '🍎',
      title: 'Apple TV+ Has No Library — Netflix and Max Have the Same Shows',
      detail: hasNetflixOrMax
        ? 'Apple TV+ is only a handful of originals — no movies, no library, no older shows from other networks. The prestige dramas on Apple TV+ (Severance, Ted Lasso, The Morning Show) are the same type of content you already get on Netflix and Max, which have thousands more options. When you finish the one show you\'re watching on Apple TV+, cancel it and stay on the services you already pay for.'
        : 'Apple TV+ has no library — it\'s only original shows, nothing else. No movies, no older series, no content from other networks. When you finish a show, cancel immediately and resubscribe only when a specific new show comes out. You could go months without needing it and save $12.99 every month you\'re not actively watching something.',
      saving: 12.99,
    })
  }

  // YouTube Premium - suggest family plan
  if (has('youtube-premium')) {
    tips.push({
      icon: '▶️',
      title: 'Split YouTube Premium With Family and Pay $4-8/mo Each',
      detail: 'YouTube Premium Individual is $15.99/mo, but the Family Plan is $22.99/mo and covers up to 5 people in your household. Split it with one other person and you each pay $11.50. Split it three ways and it\'s $7.66 each. Split it five ways and it\'s only $4.60 per person — that\'s $11/mo back in your pocket for the exact same experience. Also worth checking: if you already pay for Spotify or Apple Music, you\'re doubling up on music streaming since YouTube Premium includes YouTube Music. You might not need both.',
      saving: null,
    })
  }

  // Discovery+ with Max
  if (hasAny('discovery-ads', 'discovery-premium') && hasAny('max-ads', 'max-ad-free', 'max-ultimate')) {
    tips.push({
      icon: '🔭',
      title: 'Discovery+ Is Already Inside Max — You\'re Paying the Same Company Twice',
      detail: 'Max and Discovery+ are owned by the exact same company — Warner Bros. Discovery. They built Max specifically to be the home for all Discovery content. So when you subscribe to both, you\'re paying the same company twice for content they\'ve already put on one platform. Max has the full Discovery library: Planet Earth, Shark Week, Top Chef, 90 Day Fiancé, House Hunters, Deadliest Catch, MythBusters, and thousands more reality and nature shows. Open Max right now and search for any show you watch on Discovery+ — it\'s almost certainly already there. Cancel Discovery+ today.',
      saving: has('discovery-premium') ? 9.99 : 5.99,
    })
  }

  // Peacock + Paramount overlap
  if (hasAny('peacock-select', 'peacock-ads', 'peacock-premium') && hasAny('paramount-ads', 'paramount-premium')) {
    tips.push({
      icon: '📡',
      title: 'Peacock and Paramount+ Are the Same Service With Different Logos',
      detail: 'Peacock is NBC and Universal — Law & Order, Bravo reality shows, The Office, some sports. Paramount+ is CBS and Showtime — NCIS, Yellowstone, FBI, Billions, procedural dramas. Both are mid-tier services built around the exact same formula: crime procedurals, reality TV, and partial live sports coverage at similar price points. The audiences overlap almost completely. Pick the one where you have a show actively airing right now and drop the other. You\'re not losing a different type of content — you\'re just choosing which version of the same content you prefer.',
      saving: null,
    })
  }

  // Has ESPN standalone
  if (has('espn')) {
    tips.push({
      icon: '🏈',
      title: 'ESPN Is $29.99/mo — Go Seasonal and Only Pay During Your Sport\'s Season',
      detail: 'ESPN Unlimited covers UFC, college football, college basketball, MLB, NHL, MLS, tennis, and more — but think honestly about how many of those you actually watch. If you\'re mainly subscribing for one or two sports, you\'re paying $30/mo year-round for 5-7 months of real use. NFL season ends in February. NBA and NHL end in June. MLB ends in October. Cancel after your sport\'s playoffs and resubscribe when the next season kicks off. ESPN has zero cancellation fees and your account stays active. Going seasonal instead of year-round could save you $90-180/year on a single subscription.',
      saving: null,
    })
  }

  // Has 4+ services total
  if (selected.length >= 4) {
    tips.push({
      icon: '📅',
      title: 'With 4+ Services, the \'One at a Time\' Strategy Saves You Hundreds Per Year',
      detail: 'With 4+ services, you\'re almost certainly leaving content unwatched on most of them every month — there are only so many hours in a day. The fix is simple: pick whichever service has the show or movie you most want to watch right now. Finish everything on your list. Cancel it. Move to the next one. None of these services charge cancellation fees, none lock you into a contract, and your watchlist and account history stay saved when you come back. If you pay for one service at a time at an average of $15/mo instead of four at $60+/mo, you save $45+ every single month — that\'s over $500 a year — and you\'ll actually finish the shows you start instead of bouncing between apps and watching nothing.',
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
