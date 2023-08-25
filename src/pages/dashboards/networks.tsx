import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

export default function PublicationsDashboard() {
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{`BrCris - ${t('Experts networks dashboard')}`}</title>
      </Head>
      <div className="page-search">
        <div className="App">
          <div className="container page">
            <div className="page-title">
              <h1>{t('Experts networks dashboard')}</h1>
            </div>
            <p>Em construção...</p>
          </div>
        </div>
      </div>
    </>
  );
}
