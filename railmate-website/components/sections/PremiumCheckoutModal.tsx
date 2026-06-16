// components/sections/PremiumCheckoutModal.tsx
'use client'

import { useState } from 'react'
import { X, Crown, CheckCircle, CircleNotch, Lock } from '@phosphor-icons/react'
import { useI18n } from '@/lib/i18n'

interface PremiumCheckoutModalProps {
  open: boolean
  onClose: () => void
}



export default function PremiumCheckoutModal({ open, onClose }: PremiumCheckoutModalProps) {
  const { t } = useI18n()
  const s = t.pricing_section

  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  if (!open) return null

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan }),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-bg-elevated border border-border-subtle rounded-2xl shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close checkout"
          className="absolute top-4 right-4 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-1">
            <Crown size={18} className="text-accent" weight="fill" />
            <span className="text-xs font-bold uppercase tracking-widest text-accent font-inter">
              {s.pro_label}
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-text-primary font-jakarta mb-5">
            {s.checkout_title}
          </h3>

          {/* Plan toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-bg-card rounded-xl mb-6">
            <button
              onClick={() => setPlan('monthly')}
              className={`py-2.5 rounded-lg text-sm font-semibold font-inter transition-colors ${
                plan === 'monthly' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {s.monthly_label}
            </button>
            <button
              onClick={() => setPlan('annual')}
              className={`py-2.5 rounded-lg text-sm font-semibold font-inter transition-colors relative ${
                plan === 'annual' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {s.annual_label}
              <span className="absolute -top-2 -right-1 bg-accent text-bg-base text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                -33%
              </span>
            </button>
          </div>

          {/* Payment notice */}
          <div className="mb-6 flex items-center justify-center gap-2 text-xs text-text-tertiary font-inter">
            <Lock size={13} className="text-text-tertiary flex-shrink-0" />
            <span>Secure payment via Google Play Billing · Cancel anytime</span>
          </div>

          {/* Honest status note */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-6">
            <p className="text-text-secondary text-xs leading-relaxed font-inter">
              {s.beta_note}
            </p>
          </div>

          {/* Waitlist form */}
          {status === 'success' ? (
            <div className="flex items-center gap-2 text-primary text-sm font-semibold font-inter p-3 bg-primary/10 rounded-lg">
              <CheckCircle size={18} weight="fill" />
              {s.waitlist_success}
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={s.waitlist_placeholder}
                className="flex-1 bg-bg-card border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-5 py-3 bg-primary hover:bg-primary-dim text-white text-sm font-bold rounded-lg font-inter transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <CircleNotch size={16} className="animate-spin" /> : s.waitlist_cta}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-danger text-xs font-inter mt-2">{s.waitlist_error}</p>
          )}
        </div>
      </div>
    </div>
  )
}