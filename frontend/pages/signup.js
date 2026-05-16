import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AuthShell, { AuthMessage } from '../components/AuthShell'
import { supabase } from '../lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', text: '' })

    if (!supabase) {
      setStatus({ type: 'error', text: 'Supabase env keys missing in frontend/.env' })
      return
    }

    if (password !== confirmPassword) {
      setStatus({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    })
    setLoading(false)

    if (error) {
      setStatus({ type: 'error', text: error.message })
      return
    }

    if (data.session) {
      router.push('/account')
      return
    }

    setStatus({ type: 'success', text: 'Account created. Check your email to confirm your account.' })
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Sign up with email and password."
      footer={<><span>Already registered? </span><Link href="/login">Login</Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </label>
        <label>
          Confirm Password
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
      </form>
      <AuthMessage type={status.type}>{status.text}</AuthMessage>
    </AuthShell>
  )
}
