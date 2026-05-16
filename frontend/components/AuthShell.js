import Link from 'next/link'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link href="/" className="auth-brand">FociStore</Link>
        <h1>{title}</h1>
        {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </section>
    </main>
  )
}

export function AuthMessage({ type = 'info', children }) {
  if (!children) return null
  return <div className={`auth-message auth-message-${type}`}>{children}</div>
}
