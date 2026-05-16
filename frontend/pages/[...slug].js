import Head from 'next/head'
import Script from 'next/script'

export default function Page({ html, title, scripts }) {
  return (
    <>
      <Head>
        <title>{title || 'Focistore'}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {scripts?.map(src => (
        <Script key={src} src={src} strategy="afterInteractive" />
      ))}
    </>
  )
}

export async function getStaticPaths() {
  const fs = require('fs')
  const path = require('path')
  const publicPages = path.join(process.cwd(), 'public', 'pages')
  let files = []
  try {
    files = fs.readdirSync(publicPages).filter(f => f.endsWith('.html'))
  } catch (e) {
    files = []
  }
  const paths = files.filter(f => f !== 'index.html').flatMap(f => {
    const name = f.replace(/\.html$/, '')
    return [
      { params: { slug: [name] } },
      { params: { slug: [f] } },
    ]
  })
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const fs = require('fs')
  const path = require('path')
  const slugArr = params?.slug || []
  const slugPath = slugArr.join('/')
  const filename = slugArr.length === 0
    ? 'index.html'
    : slugPath.endsWith('.html')
      ? slugPath
      : `${slugPath}.html`
  const filePath = path.join(process.cwd(), 'public', 'pages', filename)
  let content = ''
  try { content = fs.readFileSync(filePath, 'utf8') } catch (e) { content = '' }
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i)
  const title = titleMatch ? titleMatch[1] : ''
  const scripts = []
  content.replace(/<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi, (m, src) => {
    let s = src
    if (!s.startsWith('/')) {
      if (!s.includes('/')) s = `/js/${s}`
      else s = `/${s}`
    }
    scripts.push(s)
    return ''
  })

  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  let html = bodyMatch ? bodyMatch[1] : content
  html = html.replace(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/gi, '')

  // remove stylesheet links from body (we load combined global CSS)
  html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '')

  return { props: { html, title, scripts } }
}
