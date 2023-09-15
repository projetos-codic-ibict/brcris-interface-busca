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
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import AdvancedSearchBox from '../components/AdvancedSearchBox';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import { IndicatorProvider } from '../components/context/IndicatorsContext';
import CustomResultViewPublications from '../components/customResultView/CustomResultViewPublications';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import Indicators from '../components/indicators/PublicationsIndicators';
import styles from '../styles/Home.module.css';
import { CustomSearchDriverOptions } from '../types/Entities';
type Props = {
  // Add custom props here
};
export const getServerSideProps: GetServerSideProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

const INDEX_NAME = 'pesqdf-publication';
const configDefault: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(INDEX_NAME),
  searchQuery: {
    operator: 'OR',
    advanced: false,
    search_fields: {
      title_text: {
        weight: 3,
      },
      keyword_text: {},
    },
    result_fields: {
      title: {
        snippet: {},
      },
      publicationDate: {
        snippet: {},
      },
      author: {
        raw: [],
      },
      keyword: {
        snippet: {},
      },
      journal: {
        raw: {},
      },
      type: {
        raw: {},
      },
      orgunit: {
        snippet: {},
      },
      service: {
        raw: {},
      },
      vivo_link: {
        raw: {},
      },
      language: {
        raw: [],
      },
      cnpqResearchArea: {
        raw: [],
      },
    },
    disjunctiveFacets: [
      'language.type',
      'author.name',
      'keyword.type',
      'cnpqResearchArea.type',
      'publicationDate.type',
    ],

    facets: {
      language: { type: 'value' },
      'author.name': { type: 'value' },
      keyword: { type: 'value' },
      'orgunit.name': { type: 'value' },
      'journal.title': { type: 'value' },
      type: { type: 'value' },
      cnpqResearchArea: { type: 'value' },
      publicationDate: {
        type: 'range',
        ranges: [
          {
            from: '2020',
            to: new Date().getUTCFullYear().toString(),
            name: `2020 - ${new Date().getUTCFullYear()}`,
          },
          {
            from: '2015',
            to: '2020',
            name: '2015 - 2020',
          },
          {
            from: '2010',
            to: '2015',
            name: '2010 - 2015',
          },
          {
            from: '2000',
            to: '2010',
            name: '2000 - 2010',
          },
          {
            from: '1990',
            to: '2000',
            name: '1990 - 2000',
          },
          {
            from: '1950',
            to: '1990',
            name: '1950 - 1990',
          },
        ],
      },
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
    name: 'Ano ASC',
    value: [
      {
        field: 'publicationDate',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Ano DESC',
    value: [
      {
        field: 'publicationDate',
        direction: 'desc',
      },
    ],
  },
];
const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;
export default function App() {
  const { t } = useTranslation('common');
  // tradução
  SORT_OPTIONS.forEach((option) => (option.name = t(option.name)));

  const [config, setConfig] = useState(configDefault);

  function updateOpetatorConfig(op: string) {
    //@ts-ignore
    setConfig({ ...config, searchQuery: { ...config.searchQuery, operator: op } });
  }
  function updateAdvancedConfig(advancedQuery: string) {
    //@ts-ignore
    setConfig({
      ...config,
      searchQuery: { ...config.searchQuery, advanced: true, advancedQuery: advancedQuery },
    });
  }

  return (
    <div>
      <Head>
        <title>{`BrCris - ${t('Publications')}`}</title>
      </Head>
      <div className="page-search">
        <IndicatorProvider>
          <SearchProvider config={config}>
            <WithSearch mapContextToProps={({ wasSearched, results }) => ({ wasSearched, results })}>
              {({ wasSearched, results }) => {
                return (
                  <div className="App">
                    <ErrorBoundary>
                      <div className="container page">
                        <div className="page-title">
                          <h1>{t('Publications')}</h1>
                        </div>
                      </div>

                      <div className={styles.content}>
                        <Layout
                          header={
                            // <CustomSearchBox
                            //   titleFieldName="title"
                            //   itemLinkPrefix="publ_"
                            //   updateOpetatorConfig={updateOpetatorConfig}
                            //   indexName={INDEX_NAME}
                            // />
                            //@ts-ignore
                            <AdvancedSearchBox updateQueryConfig={updateAdvancedConfig} />
                          }
                          sideContent={
                            <div>
                              {wasSearched && results.length > 0 && (
                                <>
                                  <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />
                                  <div className="filters">
                                    <span className="sui-sorting__label">{t('Filters')}</span>
                                  </div>
                                </>
                              )}

                              <Facet key={'1'} field={'language'} label={t('Language')} />
                              <Facet key={'2'} field={'author.name'} label={t('Authors')} />
                              <Facet key={'3'} field={'keyword'} label={t('Keyword')} />
                              <Facet key={'4'} field={'orgunit.name'} label={t('Institution')} />
                              <Facet key={'5'} field={'journal.title'} label={t('Journal')} />
                              <Facet key={'6'} field={'type'} label={t('Type')} />
                              <Facet key={'7'} field={'cnpqResearchArea'} label={t('CNPq research area')} />
                              <Facet key={'8'} field={'publicationDate'} filterType={'none'} label={t('Year')} />
                              {/* <Facet
                            mapContextToProps={(context) => {
                              if (!context.facets['publicationDate.keyword'])
                                return context
                              return {
                                ...context,
                                facets: {
                                  ...(context.facets || {}),
                                  year: context.facets[
                                    'publicationDate.keyword'
                                  ].map((s: any) => ({
                                    ...s,
                                    data: s.data.sort((a: any, b: any) => {
                                      if (a.value > b.value) return -1
                                      if (a.value < b.value) return 1
                                      return 0
                                    }),
                                  })),
                                },
                              }
                            }}
                            field="publicationDate.keyword"
                            label="ano"
                            show={10}
                          /> */}
                            </div>
                          }
                          bodyContent={<Results resultView={CustomResultViewPublications} />}
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
                        <Indicators />
                      </div>
                    </ErrorBoundary>
                  </div>
                );
              }}
            </WithSearch>
          </SearchProvider>
        </IndicatorProvider>
      </div>
    </div>
  );
}
