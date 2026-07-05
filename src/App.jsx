import { useState, useEffect } from 'react'
import { LAST_UPDATED } from './data/services'
import ServiceSelector from './components/ServiceSelector'
import CostSummary from './components/CostSummary'
import BundleRecommendations from './components/BundleRecommendations'
import SavingsReport from './components/SavingsReport'
import Paywall from './components/Paywall'

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/4gM9AS5cicke2vC68Hc3m00'

export default function App() {
  const [selected, setSelected] = useState([])
  const [step, setStep] = useState('select')
  const [paid, setPaid] = useState(false)
  const [justPaid, setJustPaid] = useState(false)

  useEffect(() => {
    const pending = localStorage.getItem('bm_pending_payment')
    const alreadyPaid = localStorage.getItem('bm_paid') === 'true'
    const returnedFromStripe = pending && (Date.now() - parseInt(pending)) < 30 * 60 * 1000

    if (returnedFromStripe || alreadyPaid) {
      setPaid(true)
      localStorage.setItem('bm_paid', 'true')
      localStorage.removeItem('bm_pending_payment')
      if (returnedFromStripe) setJustPaid(true)
    }

    const saved = localStorage.getItem('bm_selected')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) {
          setSelected(parsed)
          if (returnedFromStripe || alreadyPaid) setStep('results')
        }
      } catch {}
    }
  }, [])

  function toggleService(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  function handleAnalyze() {
    if (selected.length === 0) return
    localStorage.setItem('bm_selected', JSON.stringify(selected))
    setStep('results')
  }

  function handleReset() {
    setSelected([])
    setStep('select')
    setPaid(false)
    setJustPaid(false)
    localStorage.removeItem('bm_paid')
    localStorage.removeItem('bm_selected')
  }

  function handlePayNow() {
    localStorage.setItem('bm_selected', JSON.stringify(selected))
    localStorage.setItem('bm_pending_payment', Date.now().toString())
    window.location.href = STRIPE_PAYMENT_LINK
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-text">Remi</span>
            <span className="logo-dot">.</span>
          </div>
          <nav className="nav">
            <span className="nav-tagline">streaming bill checker</span>
          </nav>
        </div>
      </header>

      <main className="main">
        {step === 'select' ? (
          <>
            <div className="hero">
              {justPaid && (
                <div className="paid-banner">
                  Payment confirmed! Re-select your services to see your report.
                </div>
              )}
              <div className="hero-eyebrow">honest question —</div>
              <h1>do you actually know what you're paying for streaming?</h1>
              <p>I built this after realizing I was paying <strong>$94/month</strong> across 6 services and watching maybe 2 of them. Pick yours below.</p>
            </div>

            <ServiceSelector selected={selected} onToggle={toggleService} />

            {selected.length > 0 && (
              <div className="analyze-bar">
                <div className="analyze-bar-inner">
                  <span className="analyze-count">{selected.length} service{selected.length !== 1 ? 's' : ''} selected</span>
                  <button className="btn-primary" onClick={handleAnalyze}>
                    {paid ? 'Show my savings →' : 'Check my bill →'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="results-header">
              <button className="btn-back" onClick={handleReset}>← start over</button>
              <h2>here's what you're actually paying</h2>
            </div>

            <CostSummary selected={selected} />

            {paid ? (
              <>
                <BundleRecommendations selected={selected} />
                <SavingsReport selected={selected} />
              </>
            ) : (
              <Paywall onPaySuccess={() => {
                setPaid(true)
                localStorage.setItem('bm_paid', 'true')
              }} />
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>built by a real person who was tired of overpaying &nbsp;·&nbsp; prices last verified {LAST_UPDATED}</p>
        <p>© 2025 Remi Savings</p>
      </footer>
    </div>
  )
}
