import Head from 'next/head'
import type { NextPage } from 'next'
import Layout from '../components/layouts/Layout'

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Our Privacy Policy</title>
        <meta name="description" content="Website privacy policy page" />
      </Head>

      <Layout>
        <h1 className="text-3xl font-bold font-open">
          Website privacy policy page content
        </h1>
      </Layout>
    </>
  )
}

export default PrivacyPolicy
