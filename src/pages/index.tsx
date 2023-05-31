import 'bootstrap/dist/css/bootstrap.min.css'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import AllIndexVisNetwork from '../components/AllIndexVisNetwork'
import styles from '../styles/Home.module.css'

type Props = {
  // Add custom props here
}
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
})

export default function App() {
  // const [config, setConfig] = useState(configDefault)
  const router = useRouter()
  const { t } = useTranslation('common')

  const indexes = [
    { name: 'Publications', page: 'publications' },
    { name: 'People', page: 'people' },
    { name: 'Journals', page: 'journals' },
    { name: 'Institutions', page: 'institutions' },
    { name: 'Patents', page: 'patents' },
    { name: 'Programs', page: 'programs' },
    { name: 'Research Groups', page: 'groups' },
    { name: 'Software', page: 'software' },
  ]
  const partners = [
    {
      url: 'https://www.gov.br/ibict/pt-br',
      path: '/logos/logo-ibict-pb.png',
      description: 'Logo do IBICT',
      class: 'hilight',
    },
    {
      url: 'http://www.finep.gov.br/',
      path: '/logos/finep-pb.png',
      description: 'Logo do Finep',
    },
    {
      url: 'https://www.fap.df.gov.br/',
      path: '/logos/Extensa_Branca1_FAPDF.png',
      description: 'Logo do fapdf',
    },
    {
      url: 'https://portal.fiocruz.br/',
      path: '/logos/logo-fiocruz-pb.png',
      description: 'Logo da Fiocruz',
      class: 'hilight',
    },
    {
      url: 'https://www.gov.br/cnpq/pt-br',
      path: '/logos/CNPq_v2017_rgb_neg.png',
      description: 'Logo do CNPq',
    },
    {
      url: 'https://www.fundep.ufmg.br/',
      path: '/logos/FUNDEP-PB.png',
      description: ' Logo do FUNDEP',
    },
    {
      url: 'https://www.lareferencia.info/pt/',
      path: '/logos/la_referencia_pb.png',
      description: ' Logo do LA Referencia',
      class: 'hilight',
    },
  ]
  const [term, setTerm] = useState('')
  const [searchPage, setSearchPage] = useState('publications')

  return (
    <>
      <Head>
        <title>{`BrCris - ${t('Home')}`}</title>
      </Head>
      <div className={styles.home}>
        <div className={styles.textWhite}>
          <div className={`container pag ${styles.main}`}>
            <AllIndexVisNetwork />
            <section>
              <div className="card search-card">
                <div className="card-body">
                  <ul className="nav nav-tabs" role="tablist">
                    {indexes.map((indice, index) => (
                      <li key={index} className="nav-item" role="presentation">
                        <button
                          className={
                            index === 0 ? 'nav-link active' : 'nav-link'
                          }
                          data-bs-toggle="tab"
                          data-bs-target="#tabForm"
                          type="button"
                          role="tab"
                          aria-controls="form"
                          aria-selected="true"
                          onClick={() => setSearchPage(indice.page)}
                        >
                          {t(indice.name)}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="tab-content" id="tabContent">
                    <div
                      className="tab-pane fade active show"
                      id="tabForm"
                      role="tabpanel"
                      aria-labelledby="form-tab"
                    >
                      <form
                        className="g-3 mb-3 d-flex gap-2"
                        action={`/${router.locale}/${searchPage}`}
                      >
                        <div className="col-full">
                          <input
                            className="form-control seacrh-box"
                            name="q"
                            type="text"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder={`${t('Search')}...`}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            className="btn btn-light search-btn col-auto"
                            // disabled={!term || term.length < 3}
                          >
                            {t('Search')}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <p>{t('BrCrisText')}</p>
              </div>
            </section>
          </div>
        </div>

        <div className="container-fluid page px-5 mb-5">
          <div className="partners">
            {partners.map((partner, index) => (
              <div key={index} className={partner.class}>
                <a href={partner.url} target="_blank" rel="noreferrer">
                  <picture>
                    <img src={partner.path} alt={partner.description} />
                  </picture>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
