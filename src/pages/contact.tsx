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
    ...(await serverSideTranslations(locale ?? 'en', ['contact', 'navbar'])),
  },
})

export default function About() {
  return (
    <>
      <Navbar />

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
