import Head from 'next/head'
import type { NextPage } from 'next'

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Our Privacy Policy</title>
        <meta name="description" content="Website privacy policy page" />
      </Head>
      <div className="container">
        <p className="text-3xl font-bold font-open py-4">
          Website privacy policy page content
        </p>
      </div>
    </>
  )
}

export default PrivacyPolicy
