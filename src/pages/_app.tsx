import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { appWithTranslation } from 'next-i18next'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])
  return (
    <>
      <Component {...pageProps} />{' '}
    </>
  )
}

export default appWithTranslation(MyApp)
