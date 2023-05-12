import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { appWithTranslation } from 'next-i18next'
import Layout from '../components/layouts/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])
  return (
    <Layout>
      <Component {...pageProps} />{' '}
    </Layout>
  )
}

export default appWithTranslation(MyApp)
