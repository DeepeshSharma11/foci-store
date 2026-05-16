import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AuthShell, { AuthMessage } from '../components/AuthShell'
import { supabase } from '../lib/supabaseClient'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState({ type: 'info', text: 'Opening reset session...' })
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setStatus({ type: 'error', text: 'Supabase env keys missing in frontend/.env' })
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session))
      setStatus(data.session
        ? { type: '', text: '' }
        : { type: 'error', text: 'Reset session not found. Open the latest reset link from your email.' }
      )
    })
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setStatus({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setStatus({ type: 'error', text: error.message })
      return
    }

    setStatus({ type: 'success', text: 'Password updated successfully.' })
    setTimeout(() => router.push('/account'), 700)
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Set a new password for your account."
      footer={<><Link href="/login">Back to login</Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          New Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} disabled={!ready} />
        </label>
        <label>
          Confirm Password
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} disabled={!ready} />
        </label>
        <button type="submit" disabled={loading || !ready}>{loading ? 'Updating...' : 'Update Password'}</button>
      </form>
      <AuthMessage type={status.type}>{status.text}</AuthMessage>
    </AuthShell>
  )
}
