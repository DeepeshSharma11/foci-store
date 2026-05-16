import Page, { getStaticProps as getCatchAllStaticProps } from './[...slug]'

export default Page

export async function getStaticProps() {
  return getCatchAllStaticProps({ params: { slug: [] } })
}
