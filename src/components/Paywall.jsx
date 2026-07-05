import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_live_51TpG16CunZSwfGexHXJ7JYovDMV3RUBxz1Z6IrfSv1SBJO3Et6OIsKj9LdAzjw3QccH3QmsVh2Oa7Lw593EMxI0l00TbZrxpOh')

const appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#fb923c',
    colorBackground: '#272727',
    colorSurface: '#1e1e1e',
    colorText: '#f0ede8',
    colorTextSecondary: '#888888',
    colorDanger: '#f87171',
    borderRadius: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontSizeBase: '15px',
    spacingUnit: '5px',
  },
  rules: {
    '.Input': {
      border: '1px solid #2f2f2f',
      backgroundColor: '#1e1e1e',
      color: '#f0ede8',
    },
    '.Input:focus': {
      border: '1px solid #fb923c',
      boxShadow: '0 0 0 2px rgba(251,146,60,0.15)',
    },
    '.Label': {
      color: '#888888',
      fontSize: '12px',
      textTransform: 'lowercase',
      letterSpacing: '0.3px',
    },
    '.Tab': {
      border: '1px solid #2f2f2f',
      backgroundColor: '#1e1e1e',
    },
    '.Tab--selected': {
      border: '1px solid #fb923c',
      backgroundColor: '#272727',
    },
  },
}

function CheckoutForm({ onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message)
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message)
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <PaymentElement />
      {error && <div className="checkout-error">{error}</div>}
      <button className="btn-pay" type="submit" disabled={!stripe || loading}>
        {loading ? 'processing...' : 'unlock my savings — $4.99'}
      </button>
      <p className="paywall-guarantee">one-time · 30-day money back if it's not worth it</p>
    </form>
  )
}

export default function Paywall({ onPaySuccess }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  async function handleUnlock() {
    setShowForm(true)
    setFetchError(null)
    try {
      const res = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setClientSecret(data.clientSecret)
    } catch (err) {
      setFetchError('Something went wrong. Please try again.')
      setShowForm(false)
    }
  }

  return (
    <div className="paywall">
      <div className="paywall-preview">
        <div className="paywall-blur-label">your savings breakdown</div>
        <div className="paywall-blur-rows">
          <div className="blur-row" />
          <div className="blur-row blur-row-short" />
          <div className="blur-row blur-row-tall" />
          <div className="blur-row blur-row-short" />
        </div>
      </div>

      <div className="paywall-box">
        {!showForm ? (
          <>
            <div className="paywall-lock">🔒</div>
            <h3>want to see how to fix it?</h3>
            <p>For $4.99 I'll show you the exact bundle deals you're missing and how much you'd save every single month. Most people save $20–40/month — that's $480 a year.</p>
            <ul className="paywall-features">
              <li>✓ bundle deals you're missing</li>
              <li>✓ which tiers are a waste of money</li>
              <li>✓ how much you save per year</li>
              <li>✓ what to actually keep vs cancel</li>
            </ul>
            {fetchError && <div className="checkout-error">{fetchError}</div>}
            <button className="btn-pay" onClick={handleUnlock}>
              show me how to save — $4.99
            </button>
            <p className="paywall-guarantee">one-time · 30-day money back if it's not worth it</p>
          </>
        ) : (
          <>
            <h3>enter your payment details</h3>
            <p className="paywall-sub">secure payment · $4.99 one-time</p>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <CheckoutForm onSuccess={onPaySuccess} />
              </Elements>
            ) : (
              <div className="checkout-loading">loading payment form...</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
