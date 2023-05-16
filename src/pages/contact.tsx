import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import ContactForm from '../components/ContactForm'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'

type Props = {
  // Add custom props here
}
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['contact', 'navbar'])),
  },
})

export default function About() {
  const { t } = useTranslation('contact')
  return (
    <>
      <Head>
        <title>BrCris - {t('Contact')}</title>
      </Head>
      <div className="page-search">
        <div className="App">
          <div className="container page">
            <div className="row justify-content-center m-5">
              <div className="col-md-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
