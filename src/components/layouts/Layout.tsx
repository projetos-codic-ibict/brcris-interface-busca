import Navbar from '../Navbar'
import Footer from '../Footer'
import { PropsWithChildren } from 'react'
import CookieConsent from '../banners/CookieConsent'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <CookieConsent />
      <Footer />
    </>
  )
}
