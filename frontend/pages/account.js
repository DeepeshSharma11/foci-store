import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AuthShell, { AuthMessage } from '../components/AuthShell'
import { supabase } from '../lib/supabaseClient'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState({ type: 'info', text: 'Checking session...' })

  useEffect(() => {
    if (!supabase) {
      setStatus({ type: 'error', text: 'Supabase env keys missing in frontend/.env' })
      return
    }

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.replace('/login')
        return
      }

      setUser(data.user)
      setStatus({ type: '', text: '' })
    })
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <AuthShell
      title="Account"
      subtitle="You are logged in."
      footer={<><Link href="/admin">Admin panel</Link><span> · </span><Link href="/">Go to home</Link></>}
    >
      {user ? (
        <div className="auth-account">
          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      ) : null}
      <AuthMessage type={status.type}>{status.text}</AuthMessage>
    </AuthShell>
  )
}
