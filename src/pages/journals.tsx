/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ErrorBoundary,
  Facet,
  Paging,
  PagingInfo,
  Results,
  ResultsPerPage,
  SearchProvider,
  Sorting,
  WithSearch,
} from '@elastic/react-search-ui';
import { Layout } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
import { useState } from 'react';
import CustomResultViewJournals from '../components/customResultView/CustomResultViewJournals';
import styles from '../styles/Home.module.css';
// import OperatorSelect from '../components/OperatorSelect'
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { containsResults } from '../../utils/Utils';
import CustomSearchBox from '../components/CustomSearchBox';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import DownloadModal from '../components/DownloadModal';
import Loader from '../components/Loader';
import { CustomProvider } from '../components/context/CustomContext';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import JornalsIndicators from '../components/indicators/JornalsIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

const INDEX_NAME = process.env.INDEX_JOURNAL || '';

const configDefault: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(INDEX_NAME),
  searchQuery: {
    index: INDEX_NAME,
    operator: 'OR',
    search_fields: {
      title_text: {},
      issn: {},
      issnl: {},
      status: {},
      qualis: {},
      type: {},
    },

    result_fields: {
      id: {
        raw: {},
      },
      title: {
        raw: {},
      },
      accessType: {
        raw: {},
      },
      issn: {
        raw: {},
      },
      issnl: {
        raw: {},
      },
      keywords: {
        raw: {},
      },
      status: {
        raw: {},
      },
      qualis: {
        raw: {},
      },
      type: {
        raw: {},
      },
      H5index: {
        raw: {},
      },
      publisher: {
        raw: [],
      },
    },
    disjunctiveFacets: ['status', 'publisher.name'],

    facets: {
      qualis: { type: 'value' },
      status: { type: 'value' },
      type: { type: 'value' },
      'publisher.name': { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        title_suggest: {
          weight: 3,
        },
      },
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true,
          },
        },
        vivo_link: {
          raw: {},
        },
      },
    },
    suggestions: {
      types: {
        results: { fields: ['title_completion'] },
      },
      size: 5,
    },
  },
};
type SortOptionsType = {
  name: string;
  value: any[];
};
const SORT_OPTIONS: SortOptionsType[] = [
  {
    name: 'Relevance',
    value: [],
  },
  {
    name: 'Title ASC',
    value: [
      {
        field: 'title',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Title DESC',
    value: [
      {
        field: 'title',
        direction: 'desc',
      },
    ],
  },
];

export default function App() {
  // const [config, setConfig] = useState(configDefault)
  const { t } = useTranslation('common');
  // tradução
  SORT_OPTIONS.forEach((option) => (option.name = t(option.name)));

  const [config, setConfig] = useState(configDefault);

  function updateOpetatorConfig(op: string) {
    //@ts-ignore
    setConfig({ ...config, searchQuery: { ...config.searchQuery, operator: op } });
  }

  return (
    <div>
      <Head>
        <title>{`BrCris - ${t('Journals')}`}</title>
      </Head>
      <div className="page-search">
        <CustomProvider>
          <SearchProvider config={config}>
            <WithSearch
              mapContextToProps={({ wasSearched, results, isLoading }) => ({ wasSearched, results, isLoading })}
            >
              {({ wasSearched, results, isLoading }) => {
                return (
                  <div className="App">
                    <div className="container page">
                      <div className="page-title">
                        <h1>{t('Journals')}</h1>
                      </div>
                    </div>

                    <div className={styles.content}>
                      <div className={styles.searchLayout}>
                        {isLoading ? <Loader /> : ''}
                        <Layout
                          header={
                            <CustomSearchBox
                              titleFieldName="title"
                              itemLinkPrefix="journ_"
                              updateOpetatorConfig={updateOpetatorConfig}
                              indexName={INDEX_NAME}
                              //@ts-ignore
                              fieldNames={Object.keys(config.searchQuery.search_fields)}
                            />
                          }
                          sideContent={
                            <ErrorBoundary className={styles.searchErrorHidden}>
                              {containsResults(wasSearched, results) && (
                                <>
                                  <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />
                                  <div className="filters">
                                    <span className="sui-sorting__label">{t('Filters')}</span>
                                  </div>
                                </>
                              )}
                              {containsResults(wasSearched, results) && (
                                <>
                                  <Facet key={'1'} field={'qualis'} label={t('Qualis')} />
                                  <Facet key={'2'} field={'status'} label={t('Status')} />
                                  <Facet key={'3'} field={'type'} label={t('Type')} />
                                  <Facet key={'4'} field={'publisher.name'} label={t('Publisher')} />
                                </>
                              )}
                            </ErrorBoundary>
                          }
                          bodyContent={
                            <ErrorBoundary
                              className={styles.searchError}
                              view={({ className, error }) => (
                                <>
                                  {error && <p className={`sui-search-error ${className}`}>{t(error.trim())}</p>}
                                  {!error && wasSearched && results.length == 0 && (
                                    <strong>{t('No documents were found for your search')}</strong>
                                  )}
                                  {!error && (
                                    <>
                                      <div className="result">
                                        <Results resultView={CustomResultViewJournals} /> <Paging />
                                      </div>
                                      <JornalsIndicators />
                                    </>
                                  )}
                                </>
                              )}
                            ></ErrorBoundary>
                          }
                          bodyHeader={
                            <ErrorBoundary className={styles.searchErrorHidden}>
                              {containsResults(wasSearched, results) && (
                                <div className="d-flex align-items-center">
                                  <PagingInfo view={CustomViewPagingInfo} />
                                </div>
                              )}
                              {containsResults(wasSearched, results) && (
                                <div className="d-flex gap-2  align-items-center">
                                  <ResultsPerPage options={[10, 20, 50]} /> <DownloadModal />
                                </div>
                              )}
                            </ErrorBoundary>
                          }
                          // bodyFooter={<Paging />}
                        />
                      </div>
                    </div>
                  </div>
                );
              }}
            </WithSearch>
          </SearchProvider>
        </CustomProvider>
      </div>
    </div>
  );
}
