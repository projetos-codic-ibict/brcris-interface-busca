import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { IoArrowDown, IoSearch } from 'react-icons/io5';
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
    { text: 'PPGs', page: 'programs', name: process.env.INDEX_PROGRAM || '' },
    { text: 'Research Groups', page: 'groups', name: process.env.INDEX_GROUP || '' },
    { text: 'Softwares', page: 'softwares', name: process.env.INDEX_SOFTWARE || '' },
  ];
  const partners = [
    {
      url: 'https://www.gov.br/ibict/pt-br',
      path: '/logos/ibict.png',
      description: 'Logo do IBICT',
      // class: 'hilight',
    },
    {
      url: 'http://www.finep.gov.br/',
      path: '/logos/finep.png',
      description: 'Logo do Finep',
    },
    {
      url: 'https://www.fap.df.gov.br/',
      path: '/logos/fapdf.png',
      description: 'Logo do fapdf',
      class: 'minus',
    },
    {
      url: 'https://portal.fiocruz.br/',
      path: '/logos/fiocruz.png',
      description: 'Logo da Fiocruz',
      // class: 'hilight',
    },
    {
      url: 'https://www.gov.br/cnpq/pt-br',
      path: '/logos/cnpq.png',
      description: 'Logo do CNPq',
    },
    {
      url: 'https://www.fundep.ufmg.br/',
      path: '/logos/fundep.png',
      description: ' Logo do FUNDEP',
      class: 'minus',
    },
    {
      url: 'https://www.lareferencia.info/pt/',
      path: '/logos/lareferencia.png',
      description: 'Logo do LA Referencia',
      // class: 'hilight',
    },
  ];
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [term, setTerm] = useState('');
  const [searchPage, setSearchPage] = useState('publications');
  const [selectedIndex, setSelectedIndex] = useState(process.env.INDEX_PUBLICATION || '');
  const [docsCount, setDocsCount] = useState('');

  const handleSelectChange = (event: any) => {
    const selectedOption = indexes.find((item) => item.name === event.target.value);
    if (selectedOption) {
      setSearchPage(selectedOption.page);
      setSelectedIndex(selectedOption.name);
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
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
        <div className="search-card">
          <h1>{t('Search in the Brazilian Scientific Research Information Ecosystem')} (BrCris)</h1>
          <form className="form-search" action={`/${router.locale}/${searchPage}`}>
            <div className="form-group">
              <div className="custom-select">
                <select id="index-select" onChange={handleSelectChange} title={t('Select an entity') || ''}>
                  {indexes.map((index) => (
                    <option key={index.name} value={index.name}>
                      {t(index.text)}
                    </option>
                  ))}
                </select>
              </div>
              <input
                ref={inputRef}
                name="q"
                autoFocus
                title={`${t('Enter at least 3 characters and search among')} ${t('numberFormat', {
                  value: docsCount,
                })} ${t(searchPage)}`}
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={`${t('Enter at least 3 characters and search among')} ${t('numberFormat', {
                  value: docsCount,
                })} ${t(searchPage)}`}
              />
            </div>
            <button disabled={term?.trim().length < 3} className="btn btn-primary" title={t('Search') || 'Search'}>
              <IoSearch /> {t('Search')}
            </button>
          </form>
        </div>
      </div>
      <section className={styles.informations}>
        <div className={styles.more}>
          <a href="#more">
            <IoArrowDown />
            Saiba mais
          </a>
        </div>
        <section className={styles.about}>
          <div className="card text-center p-2">
            <h2>{t('Open Science')}</h2>
            <div className="card-body">
              <p className="card-text">{t('lorem ipsum')}</p>
            </div>
          </div>
          <div className="card text-center p-2">
            <h2>{t('Data Sources')}</h2>
            <div className="card-body">
              <p className="card-text">{t('lorem ipsum')}</p>
            </div>
          </div>
          <div className="card text-center p-2">
            <h2>{t('About')}</h2>
            <div className="card-body">
              <p className="card-text">{t('lorem ipsum')}</p>
            </div>
          </div>
        </section>
        <section id="partners" className="container-fluid">
          <h2 className="text-center">{t('BrCris Partners')}</h2>
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
        </section>
      </section>
    </>
  );
}
