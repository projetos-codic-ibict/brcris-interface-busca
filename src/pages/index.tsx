import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AllIndexVisNetwork from '../components/AllIndexVisNetwork';
import styles from '../styles/Home.module.css';

type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

export default function App() {
  // const [config, setConfig] = useState(configDefault)
  const router = useRouter();
  const { t } = useTranslation(['common']);

  const indexes = [
    { text: 'Publications', page: 'publications', name: process.env.INDEX_PUBLICATION || '' },
    { text: 'People', page: 'people', name: process.env.INDEX_PERSON || '' },
    { text: 'Journals', page: 'journals', name: process.env.INDEX_JOURNAL || '' },
    { text: 'Institutions', page: 'institutions', name: process.env.INDEX_ORGUNIT || '' },
    { text: 'Patents', page: 'patents', name: process.env.INDEX_PATENT || '' },
    { text: 'Programs', page: 'programs', name: process.env.INDEX_PROGRAM || '' },
    { text: 'Research Groups', page: 'groups', name: process.env.INDEX_GROUP || '' },
    { text: 'Software', page: 'software', name: process.env.INDEX_SOFTWARE || '' },
  ];
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
      path: '/logos/cnpq-logo.png',
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
  ];
  const [term, setTerm] = useState('');
  const [searchPage, setSearchPage] = useState('publications');
  const [selectedIndex, setSelectedIndex] = useState(process.env.INDEX_PUBLICATION || '');
  const [docsCount, setDocsCount] = useState('');

  useEffect(() => {
    setDocsCount(localStorage.getItem(selectedIndex) || '');
  }, [selectedIndex]);

  return (
    <>
      <Head>
        <title>{`BrCris - ${t('Home')}`}</title>
        <meta
          name="description"
          content={
            t(
              'The Brazilian Scientific Research Information Ecosystem, BrCris, is an aggregator platform that allows retrieving, certifying and visualizing data and information related to the various actors who work in scientific research in the Brazilian context.'
            ) || ''
          }
        />
      </Head>
      <div className={styles.home}>
        <div className={styles.textWhite}>
          <div className={`container page ${styles.main}`}>
            <div className={`card search-card ${styles.cardHome}`}>
              <div className="card-body">
                <ul className="nav nav-tabs" role="tablist">
                  {indexes.map((indice, index) => (
                    <li key={index} className="nav-item" role="presentation">
                      <button
                        className={index === 0 ? 'nav-link active' : 'nav-link'}
                        data-bs-toggle="tab"
                        data-bs-target="#tabForm"
                        type="button"
                        role="tab"
                        aria-controls="form"
                        aria-selected="true"
                        onClick={() => {
                          setSearchPage(indice.page);
                          setSelectedIndex(indice.name);
                        }}
                      >
                        {t(indice.text)}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="tab-content" id="tabContent">
                  <div className="tab-pane fade active show" id="tabForm" role="tabpanel" aria-labelledby="form-tab">
                    <form className="g-3 mb-3 d-flex gap-2" action={`/${router.locale}/${searchPage}`}>
                      <div className="col-full">
                        <input
                          className="form-control search-box"
                          name="q"
                          type="text"
                          value={term}
                          onChange={(e) => setTerm(e.target.value)}
                          placeholder={`${t('Enter at least 3 characters and search among')} ${t('numberFormat', {
                            value: docsCount,
                          })} ${t(searchPage)}`}
                        />
                      </div>
                      <div className="col-auto">
                        <button disabled={term?.trim().length < 3} className="btn btn-secondary search-btn col-auto">
                          {t('Search')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.info}>
              <section>
                <AllIndexVisNetwork />
              </section>
              <section>
                <div className="mt-5">
                  <p>
                    {t(
                      'The Brazilian Scientific Research Information Ecosystem, BrCris, is an aggregator platform that allows retrieving, certifying and visualizing data and information related to the various actors who work in scientific research in the Brazilian context.'
                    )}
                  </p>
                </div>
              </section>
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
  );
}
