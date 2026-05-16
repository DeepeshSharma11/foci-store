import { useState } from 'react'
import Link from 'next/link'
import AuthShell, { AuthMessage } from '../components/AuthShell'
import { supabase } from '../lib/supabaseClient'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', text: '' })

    if (!supabase) {
      setStatus({ type: 'error', text: 'Supabase env keys missing in frontend/.env' })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)

    if (error) {
      setStatus({ type: 'error', text: error.message })
      return
    }

    setStatus({ type: 'success', text: 'Password reset link sent. Check your email.' })
  }

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link."
      footer={<><Link href="/login">Back to login</Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
      </form>
      <AuthMessage type={status.type}>{status.text}</AuthMessage>
    </AuthShell>
  )
}
