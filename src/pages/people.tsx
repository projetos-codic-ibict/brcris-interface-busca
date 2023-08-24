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
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import ClearFilters from '../components/ClearFilters';
import CustomSearchBox from '../components/CustomSearchBox';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import CustomResultViewPeople from '../components/customResultView/CustomResultViewPeople';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import IndicatorsPeople from '../components/indicators/PeopleIndicators';
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

const INDEX_NAME = 'pesqdf-person';
const configDefault = {
  ...DefaultQueryConfig(INDEX_NAME),
  searchQuery: {
    track_total_hits: true,
    operator: 'OR',
    search_fields: {
      name_text: {},
    },
    result_fields: {
      id: {
        raw: {},
      },
      name: {
        raw: {},
      },
      lattesId: {
        raw: {},
      },
      nationality: {
        raw: {},
      },
      orcid: {
        raw: {},
      },
      researchArea: {
        raw: {},
      },
    },
    disjunctiveFacets: ['nationality', 'researchArea'],
    facets: {
      nationality: { type: 'value' },
      researchArea: { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        name_suggest: {
          weight: 3,
        },
      },
      result_fields: {
        name: {
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
        results: { fields: ['name_completion'] },
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
        <title>{`BrCris - ${t('People')}`}</title>
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
                        <h1>{t('People')}</h1>
                      </div>
                    </div>

                    <div className={styles.content}>
                      <Layout
                        header={
                          <CustomSearchBox
                            titleFieldName="name"
                            itemLinkPrefix="pers_"
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
                            <Facet key={'1'} field={'nationality'} label={t('Nationality')} />
                            <Facet key={'2'} field={'researchArea'} label={t('Research area(s)')} />
                          </div>
                        }
                        bodyContent={<Results resultView={CustomResultViewPeople} />}
                        bodyHeader={
                          <>
                            {wasSearched && (
                              <div className="d-flex align-items-center">
                                <PagingInfo view={CustomViewPagingInfo} />
                                <ClearFilters />
                              </div>
                            )}
                            {wasSearched && <ResultsPerPage options={[10, 20, 50]} />}
                          </>
                        }
                        bodyFooter={<Paging />}
                      />

                      {/** 
                        // @ts-ignore */}
                      <IndicatorsPeople indicatorsState={indicatorsState} sendDataToParent={receiveChildData} />
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
