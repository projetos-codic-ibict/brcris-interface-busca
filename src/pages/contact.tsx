import { useTranslation } from 'next-i18next'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Navbar from '../components/Navbar'
import ContactForm from '../components/ContactForm'

type Props = {
  // Add custom props here
}
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
})

export default function About() {
  const { t } = useTranslation('contact')
  return (
    <>
      <Navbar />

      <div className="page-search">
        <div className="App">
          <div className="container page">
            <div className="row">
              <div className="col-md-12">
                <div className="page-title">
                  <h2>{t('Contact')}</h2>
                </div>
              </div>
            </div>

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
