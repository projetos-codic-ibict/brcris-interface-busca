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
import BasicSearchBox from '../components/BasicSearchBox';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import { CustomProvider } from '../components/context/CustomContext';
import CustomResultViewSoftwares from '../components/customResultView/CustomResultViewSoftwares';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import SoftwaresIndicators from '../components/indicators/SoftwaresIndicators';
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

const INDEX_NAME = 'pesqdf-software';
const configDefault = {
  ...DefaultQueryConfig(INDEX_NAME),
  searchQuery: {
    operator: 'OR',
    search_fields: {
      name_text: {
        weight: 3,
      },
      keyword_text: {},
    },
    result_fields: {
      id: {
        raw: {},
      },
      name: {
        raw: {},
      },
      description: {
        raw: {},
      },
      creator: {
        raw: {},
      },

      depositDate: {
        raw: {},
      },
      releaseYear: {
        raw: {},
      },

      platform: {
        raw: {},
      },
      registrationCountry: {
        raw: {},
      },
      activitySector: {
        raw: {},
      },
      knowledgeAreas: {
        raw: {},
      },
      keyword: {
        raw: {},
      },
      language: {
        raw: {},
      },
    },
    disjunctiveFacets: ['depositDate', 'releaseYear'],
    facets: {
      creator: { type: 'value' },
      registrationCountry: { type: 'value' },
      releaseYear: { type: 'value' },
      knowledgeAreas: { type: 'value' },
      language: { type: 'value' },
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

  return (
    <div>
      <Head>
        <title>{`BrCris - ${t('Softwares')}`}</title>
      </Head>
      <div className="page-search">
        <CustomProvider>
          <SearchProvider config={config}>
            <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
              {({ wasSearched }) => {
                return (
                  <div className="App">
                    <div className="container page">
                      <div className="page-title">
                        <h1>{t('Softwares')}</h1>
                      </div>
                    </div>

                    <div className={styles.content}>
                      <div className={styles.searchLayout}>
                        <Layout
                          header={
                            <BasicSearchBox
                              titleFieldName="name"
                              itemLinkPrefix="softw_"
                              updateOpetatorConfig={updateOpetatorConfig}
                              indexName={INDEX_NAME}
                              toogleAdvancedConfig={() => null}
                            />
                          }
                          sideContent={
                            <div>
                              {wasSearched && <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />}
                              <div className="filters">
                                {wasSearched && <span className="sui-sorting__label">{t('Filters')}</span>}
                              </div>
                              <Facet key={'1'} field={'creator'} label={t('Author')} />
                              <Facet key={'2'} field={'registrationCountry'} label={t('Country')} />
                              <Facet key={'4'} field={'releaseYear'} label={t('Release year')} />
                              <Facet key={'5'} field={'knowledgeAreas'} label={t('Knowledge areas')} />
                              <Facet key={'6'} field={'language'} label={t('Language')} />
                            </div>
                          }
                          bodyContent={<Results resultView={CustomResultViewSoftwares} />}
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
                        <ErrorBoundary className={styles.searchError}>
                          <span></span>
                        </ErrorBoundary>
                      </div>
                      <SoftwaresIndicators />
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
