/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Alert } from '../components/Alert';
import ContactForm from '../components/ContactForm';

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

export default function Contact() {
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{`BrCris - ${t('Contact')}`}</title>
      </Head>
      <div className="page-search">
        <div className="App">
          <div className="container page">
            <div className="row justify-content-center m-5">
              <div className="col-md-8">
                <Alert />
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
