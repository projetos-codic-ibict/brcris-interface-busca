import { useState } from 'react'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import AllPublicationsVis from '../components/AllPublicationsVis'

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
  const { t } = useTranslation('navbar')

  const partners = [
    {
      url: 'https://www.gov.br/ibict/pt-br',
      path: '/logos/logo-ibict-pb.png',
      description: 'Logo do IBICT',
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
    },
  ]
  const [term, setTerm] = useState('')
  const [searchPage, setSearchPage] = useState('publications')

  return (
    <div className={styles.home}>
      <Navbar />
      <div className={styles.textWhite}>
        <div className="container page">
          <div className="row">
            <div className="col-md-6">
              <AllPublicationsVis />
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
                        Publications
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
                        Person
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
                        Journals
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
                        Institutions
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
                            placeholder="Busca..."
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            className="btn btn-light search-btn"
                            disabled={!term || term.length < 3}
                          >
                            Search
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                  veritatis, earum distinctio nisi ipsa ea, corporis quas minus
                  placeat ducimus et, vero obcaecati labore explicabo fugit
                  illum amet eius ratione?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                  veritatis, earum distinctio nisi ipsa ea, corporis quas minus
                  placeat ducimus et, vero obcaecati labore explicabo fugit
                  illum amet eius ratione?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid page px-5 mt-3">
          <div className="partners">
            {partners.map((partner, index) => (
              <div key={index}>
                <Link href={partner.url} target="_blank">
                  <a className="">
                    <picture className="">
                      <img src={partner.path} alt={partner.description} />
                    </picture>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
