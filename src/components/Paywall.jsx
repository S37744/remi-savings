import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_live_51TpG16CunZSwfGexHXJ7JYovDMV3RUBxz1Z6IrfSv1SBJO3Et6OIsKj9LdAzjw3QccH3QmsVh2Oa7Lw593EMxI0l00TbZrxpOh')

const appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#fb923c',
    colorBackground: '#1e1e1e',
    colorText: '#f0ede8',
    colorTextSecondary: '#aaaaaa',
    colorTextPlaceholder: '#666666',
    colorDanger: '#f87171',
    borderRadius: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontSizeBase: '15px',
  },
  rules: {
    '.Input': {
      border: '1px solid #444444',
      backgroundColor: '#2a2a2a',
      color: '#f0ede8',
      padding: '12px',
    },
    '.Input::placeholder': {
      color: '#666666',
    },
    '.Input:focus': {
      border: '1px solid #fb923c',
      boxShadow: '0 0 0 2px rgba(251,146,60,0.15)',
      outline: 'none',
    },
    '.Label': {
      color: '#aaaaaa',
      fontSize: '13px',
      marginBottom: '6px',
    },
    '.Tab': {
      border: '1px solid #444444',
      backgroundColor: '#2a2a2a',
      color: '#aaaaaa',
    },
    '.Tab:hover': {
      color: '#f0ede8',
      border: '1px solid #666666',
    },
    '.Tab--selected': {
      border: '1px solid #fb923c',
      backgroundColor: '#1e1e1e',
      color: '#f0ede8',
    },
    '.TabLabel': {
      color: '#f0ede8',
    },
    '.TabIcon': {
      fill: '#f0ede8',
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
        {loading ? 'Processing Payment...' : 'Unlock My Savings — $4.99'}
      </button>
      <p className="paywall-guarantee">One-Time Payment · Instant Access</p>
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
        <div className="paywall-blur-label">Your Savings Breakdown</div>
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
            <h3>Want to See How to Fix It?</h3>
            <p>For $4.99 I'll Show You the Exact Bundle Deals You're Missing and How Much You'd Save Every Single Month. Most People Save $20–40/Month — That's $480 a Year.</p>
            <ul className="paywall-features">
              <li>✓ Bundle deals you're missing</li>
              <li>✓ Which tiers are a waste of money</li>
              <li>✓ How much you save per year</li>
              <li>✓ What to actually keep vs cancel</li>
            </ul>
            {fetchError && <div className="checkout-error">{fetchError}</div>}
            <button className="btn-pay" onClick={handleUnlock}>
              Show Me How to Save — $4.99
            </button>
            <p className="paywall-guarantee">One-Time Payment · Instant Access</p>
          </>
        ) : (
          <>
            <h3>Enter Your Payment Details</h3>
            <p className="paywall-sub">Secure Payment · $4.99 One-Time</p>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance, layout: { type: 'accordion', defaultCollapsed: false } }}>
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
