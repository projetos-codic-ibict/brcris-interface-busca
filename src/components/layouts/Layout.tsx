import { PropsWithChildren } from 'react';
import { Alert } from '../Alert';
import Footer from '../Footer';
import Navbar from '../Navbar';
import CookieConsent from '../banners/CookieConsent';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <Alert />
      <main>{children}</main>
      <CookieConsent />
      <Footer />
    </>
  );
}
