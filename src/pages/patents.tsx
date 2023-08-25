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
import styles from '../styles/Home.module.css';
/* import IndicatorsPeople from '../components/IndicatorsPeople' */
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import ClearFilters from '../components/ClearFilters';
import CustomSearchBox from '../components/CustomSearchBox';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import CustomResultViewPatents from '../components/customResultView/CustomResultViewPatents';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import PatentsIndicators from '../components/indicators/PatentsIndicators';
type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

const INDEX_NAME = 'pesqdf-patent';

const configDefault = {
  ...DefaultQueryConfig(INDEX_NAME),
  searchQuery: {
    operator: 'OR',
    search_fields: {
      espacenetTitle_text: {},
    },
    result_fields: {
      id: {
        raw: {},
      },
      espacenetTitle: {
        raw: {},
      },
      applicant: {
        raw: [],
      },
      depositDate: {
        raw: {},
      },
      kindCode: {
        raw: {},
      },
      countryCode: {
        raw: {},
      },
      lattesTitle: {
        raw: [],
      },
      publicationDate: {
        raw: [],
      },
      inventor: {
        raw: [],
      },
    },
    disjunctiveFacets: ['countryCode', 'publicationDate', 'depositDate', 'inventor', 'espacenetTitle', 'inventor.name'],
    facets: {
      countryCode: { type: 'value' },
      publicationDate: { type: 'value' },
      depositDate: { type: 'value' },
      'inventor.name': { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        espacenetTitle_suggest: {
          weight: 3,
        },
      },
      result_fields: {
        espacenetTitle: {
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
        results: { fields: ['espacenetTitle_completion'] },
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
    name: 'Nome ASC',
    value: [
      {
        field: 'name',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Nome DESC',
    value: [
      {
        field: 'name',
        direction: 'desc',
      },
    ],
  },
];

export default function App() {
  const { t } = useTranslation('common');
  // tradução
  SORT_OPTIONS.forEach((option) => (option.name = t(option.name)));

  const [config, setConfig] = useState(configDefault);

  function updateOpetatorConfig(op: string) {
    setConfig({ ...config, searchQuery: { ...config.searchQuery, operator: op } });
  }

  const [indicatorsState, setIndicatorsState] = useState({
    config,
    data: [],
  });

  const receiveChildData = (data: any) => {
    setIndicatorsState(data);
  };

  return (
    <div>
      <Head>
        <title>{`BrCris - ${t('Patents')}`}</title>
      </Head>
      <div className="page-search">
        <SearchProvider config={config}>
          <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
            {({ wasSearched }) => {
              return (
                <div className="App">
                  <ErrorBoundary>
                    <div className="container page">
                      <div className="page-title">
                        <h1>{t('Patents')}</h1>
                      </div>
                    </div>

                    <div className={styles.content}>
                      <Layout
                        header={
                          <CustomSearchBox
                            titleFieldName="espacenetTitle"
                            itemLinkPrefix="pat_"
                            updateOpetatorConfig={updateOpetatorConfig}
                            indexName={INDEX_NAME}
                          />
                        }
                        sideContent={
                          <div>
                            {wasSearched && <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />}
                            <div className="filters">
                              {wasSearched && <span className="sui-sorting__label">{t('Filters')}</span>}
                            </div>
                            <Facet key={'1'} field={'inventor.name'} label={t('Inventor')} />
                            <Facet key={'2'} field={'countryCode'} label={t('Country code')} />
                            <Facet key={'2'} field={'publicationDate'} label={t('Publication date')} />
                            <Facet key={'3'} field={'depositDate'} label={t('Deposit date')} />
                          </div>
                        }
                        bodyContent={<Results resultView={CustomResultViewPatents} />}
                        bodyHeader={
                          <>
                            {wasSearched && (
                              <div className="d-flex align-items-center">
                                <PagingInfo view={CustomViewPagingInfo} />
                                {/* <ClearFilters /> */}
                              </div>
                            )}
                            {wasSearched && <ResultsPerPage options={[10, 20, 50]} />}
                          </>
                        }
                        bodyFooter={<Paging />}
                      />
                      {/* 
                        // @ts-ignore  */}
                      <PatentsIndicators indicatorsState={indicatorsState} sendDataToParent={receiveChildData} />
                    </div>
                  </ErrorBoundary>
                </div>
              );
            }}
          </WithSearch>
        </SearchProvider>
      </div>
    </div>
  );
}
