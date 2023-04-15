import { useTranslation } from 'next-i18next'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
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
  const { t } = useTranslation('navbar')
  return (
    <>
      <h1>{t('About')}</h1>
    </>
  )
}
