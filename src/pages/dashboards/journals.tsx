/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Iframe from '../../components/dashboards/Iframe';
//@ts-ignore
type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

export default function JournalsDashboard() {
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{`BrCris - ${t('Journals dashboard')}`}</title>
      </Head>
      <div className="page-search">
        <div className="App">
          <div className="container page">
            <div className="page-title">
              <h1>{t('Journals dashboard')}</h1>
            </div>
            <Iframe url="https://dashboardbrcris.ibict.br/app/dashboards#/view/a1741c40-d72f-11ee-99d5-5b22668b83a8?embed=true&amp;_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-15m%2Cto%3Anow))" />
          </div>
        </div>
      </div>
    </>
  );
}
