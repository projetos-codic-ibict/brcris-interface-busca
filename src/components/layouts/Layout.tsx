import Navbar from '../Navbar'
import Footer from '../Footer'
import { PropsWithChildren } from 'react'
import CookieConsent from '../banners/CookieConsent'
import { Alert } from '../Alert'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <Alert />
      <main>{children}</main>
      <CookieConsent />
      <Footer />
    </>
  )
}
