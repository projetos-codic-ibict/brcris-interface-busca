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

export default function Publications() {
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{`BrCris - ${t('Publications dashboard')}`}</title>
      </Head>
      <div className="page-search">
        <div className="App">
          <div className="container page">
            <div className="row justify-content-center m-5">
              <iframe
                src="http://172.16.16.79:8080/app/dashboards#/view/5b28ef30-eb4a-11ed-8ce5-b1f0783636f8?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-15m%2Cto%3Anow))"
                height="600"
                width="800"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
