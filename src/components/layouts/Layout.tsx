import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import Footer from '../Footer';
import Navbar from '../Navbar';
import CookieConsent from '../banners/CookieConsent';

interface LayoutProps extends PropsWithChildren {
  fontFamily: string;
}

export default function Layout({ children, fontFamily }: LayoutProps) {
  const BRCRIS_HOST_BASE = process.env.BRCRIS_HOST_BASE || 'https://brcris.ibict.br';
  const router = useRouter();
  const locales = router.locales;
  const defaultLocale = router.defaultLocale;
  const currentPath = router.asPath;
  return (
    <>
      <Head>
        {locales?.map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`${BRCRIS_HOST_BASE}${lang != defaultLocale ? '/' + lang : ''}${currentPath}`}
          />
        ))}
      </Head>
      <Navbar />
      {/* <Alert /> */}
      <main style={{ paddingTop: '100px' }} className={`container  ${fontFamily}`}>
        {children}
      </main>
      <CookieConsent />
      <Footer />
    </>
  );
}
