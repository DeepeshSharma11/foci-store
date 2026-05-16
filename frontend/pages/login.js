import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AuthShell, { AuthMessage } from '../components/AuthShell'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const nextPath = typeof router.query.next === 'string' ? router.query.next : '/admin'

  useEffect(() => {
    if (!router.isReady) return

    if (!supabase) {
      setCheckingSession(false)
      return
    }

    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) {
        router.replace(nextPath)
      } else {
        setCheckingSession(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace(nextPath)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [nextPath, router, router.isReady])

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', text: '' })

    if (!supabase) {
      setStatus({ type: 'error', text: 'Supabase env keys missing in frontend/.env' })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setStatus({ type: 'error', text: error.message })
      return
    }

    router.push(nextPath)
  }

  if (checkingSession) {
    return (
      <AuthShell title="Admin Login" subtitle="Checking active session...">
        <AuthMessage type="info">Please wait.</AuthMessage>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Admin Login"
      subtitle="Only admins need to login. Public users can browse the site without an account."
      footer={
        <>
          <Link href="/">Public site</Link>
          <span> · </span><Link href="/forgot-password">Forgot password?</Link>
        </>
      }
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
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <AuthMessage type={status.type}>{status.text}</AuthMessage>
    </AuthShell>
  )
}
