import 'bootstrap/dist/css/bootstrap.min.css'; // Import bootstrap CSS
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Layout from '../components/layouts/Layout';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />{' '}
    </Layout>
  );
}

export default appWithTranslation(MyApp);
