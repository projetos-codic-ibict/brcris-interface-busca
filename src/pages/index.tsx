import { useState } from 'react'
import styles from '../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import AllIndexVisNetwork from '../components/AllIndexVisNetwork'

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

export default function App() {
  // const [config, setConfig] = useState(configDefault)
  const router = useRouter()
  const { t } = useTranslation('common')

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
      <div className={styles.home}>
        <div className={styles.textWhite}>
          <div className="container page">
            <div className="row">
              <div className="col-md-6">
                <AllIndexVisNetwork />
              </div>

              <div className="col-md-6">
                <div className="card search-card">
                  <div className="card-body">
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#tabForm"
                          type="button"
                          role="tab"
                          aria-controls="form"
                          aria-selected="true"
                          onClick={() => setSearchPage('publications')}
                        >
                          {t('Publications')}
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#tabForm"
                          type="button"
                          role="tab"
                          aria-controls="form"
                          aria-selected="false"
                          onClick={() => setSearchPage('person')}
                        >
                          {t('Person')}
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#tabForm"
                          type="button"
                          role="tab"
                          aria-controls="form"
                          aria-selected="false"
                          onClick={() => setSearchPage('journals')}
                        >
                          {t('Journals')}
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#tabForm"
                          type="button"
                          role="tab"
                          aria-controls="form"
                          aria-selected="false"
                          onClick={() => setSearchPage('institutions')}
                        >
                          {t('Institutions')}
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content" id="tabContent">
                      <div
                        className="tab-pane fade active show"
                        id="tabForm"
                        role="tabpanel"
                        aria-labelledby="form-tab"
                      >
                        <form
                          className="row g-3 mb-3"
                          action={`/${router.locale}/${searchPage}`}
                        >
                          <div className="col">
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
                              className="btn btn-light search-btn"
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
                <div className="col-md-12 mt-5">
                  <p>{t('BrCrisText')}</p>
                </div>
              </div>
            </div>
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
