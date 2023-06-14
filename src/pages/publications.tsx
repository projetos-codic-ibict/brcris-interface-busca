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
  SearchBox,
  SearchProvider,
  Sorting,
  WithSearch,
} from '@elastic/react-search-ui'
import { Layout } from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import React from 'react'
import ButtonFieldSelect from '../components/ButtonFieldSelect'
import ClearFilters from '../components/ClearFilters'
import CustomResultViewPublications from '../components/customResultView/CustomResultViewPublications'
import Indicators from '../components/indicators/PublicationsIndicators'
import Connector from '../services/APIConnector'
import styles from '../styles/Home.module.css'
// import OperatorSelect from '../components/OperatorSelect'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
type Props = {
  // Add custom props here
}
export const getServerSideProps: GetServerSideProps<Props> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
})

const connector = new Connector()

const config = {
  debug: true,
  indicators: [],
  urlPushDebounceLength: 500,
  alwaysSearchOnInitialLoad: true,
  hasA11yNotifications: true,
  apiConnector: connector,
  searchQuery: {
    index: 'pesqdf-publication',
    track_total_hits: true,
    operator: 'OR',
    search_fields: {
      title: {},
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
      // 'publicationDate.keyword': { type: 'value', size: 100 },
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
  // autocompleteQuery: {
  //   results: {
  //     search_fields: {
  //       'titlesuggest.suggest': {},
  //     },
  //     resultsPerPage: 5,
  //     result_fields: {
  //       title: {
  //         snippet: {
  //           size: 100,
  //           fallback: true,
  //         },
  //       },
  //       vivo_link: {
  //         raw: {},
  //       },
  //     },
  //   },
  //   suggestions: {
  //     types: {
  //       documents: {
  //         fields: ['suggest'],
  //       },
  //     },
  //     size: 4,
  //   },
  // },
}
type SortOptionsType = {
  name: string
  value: any[]
}
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
]

const indicatorsState = {
  config,
  data: [],
}

export default function App() {
  // const [config, setConfig] = useState(configDefault)
  const { t } = useTranslation('common')
  // tradução
  SORT_OPTIONS.forEach((option) => (option.name = t(option.name)))
  return (
    <div>
      <Head>
        <title>{`BrCris - ${t('Publications')}`}</title>
      </Head>
      <div className="page-search">
        <SearchProvider config={config}>
          <WithSearch
            mapContextToProps={({ wasSearched }) => ({ wasSearched })}
          >
            {({ wasSearched }) => {
              return (
                <div className="App">
                  <ErrorBoundary>
                    <div className="container page">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="page-title">
                            <h2>{t('Publications')}</h2>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="card search-card">
                            <div className="card-body">
                              <ul
                                className="nav nav-tabs"
                                id="myTab"
                                role="tablist"
                              >
                                <li className="nav-item" role="presentation">
                                  <ButtonFieldSelect
                                    title={t('Title')}
                                    active={true}
                                    config={config}
                                    searchField="title"
                                  />
                                </li>
                                <li className="nav-item" role="presentation">
                                  <ButtonFieldSelect
                                    title={t('Author')}
                                    active={false}
                                    config={config}
                                    searchField="author.name"
                                  />
                                </li>
                              </ul>
                              <div className="tab-content" id="myTabContent">
                                <div
                                  className="tab-pane fade show active"
                                  id="home"
                                  role="tabpanel"
                                  aria-labelledby="home-tab"
                                >
                                  <SearchBox
                                    view={({ value, onChange, onSubmit }) => (
                                      <form
                                        onSubmit={onSubmit}
                                        className="row g-3 mb-3"
                                      >
                                        <div className="col">
                                          <input
                                            className="form-control seacrh-box"
                                            type="text"
                                            value={value}
                                            onChange={(e) =>
                                              onChange(e.target.value)
                                            }
                                          />
                                        </div>
                                        <div className="col-auto">
                                          <input
                                            className="btn btn-light search-btn"
                                            type="submit"
                                            value={t('Search') || ''}
                                            disabled={
                                              !value || value.length < 3
                                            }
                                          />
                                        </div>
                                      </form>
                                    )}
                                  />
                                  <ClearFilters />
                                </div>

                                {/* <OperatorSelect config={config} /> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.content}>
                      <Layout
                        // header={}
                        sideContent={
                          <div>
                            {wasSearched && (
                              <Sorting
                                label={t('Sort by') || ''}
                                sortOptions={SORT_OPTIONS}
                              />
                            )}
                            <div className="filters">
                              <span className="sui-sorting__label">
                                Filters
                              </span>
                            </div>
                            <Facet
                              key={'1'}
                              field={'language'}
                              label={t('Language')}
                            />
                            <Facet
                              key={'2'}
                              field={'author.name'}
                              label={t('Authors')}
                            />
                            <Facet
                              key={'3'}
                              field={'keyword'}
                              label={t('Keyword')}
                            />
                            <Facet
                              key={'4'}
                              field={'orgunit.name'}
                              label={t('Institution')}
                            />
                            <Facet
                              key={'5'}
                              field={'journal.title'}
                              label={t('Journal')}
                            />
                            <Facet key={'6'} field={'type'} label={t('Type')} />
                            <Facet
                              key={'7'}
                              field={'cnpqResearchArea'}
                              label={t('Cnpq Research Area')}
                            />
                            <Facet
                              key={'8'}
                              field={'publicationDate'}
                              filterType={'none'}
                              label={t('Year')}
                            />
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
                        bodyContent={
                          <Results resultView={CustomResultViewPublications} />
                        }
                        bodyHeader={
                          <React.Fragment>
                            {wasSearched && <PagingInfo />}
                            {wasSearched && <ResultsPerPage />}
                          </React.Fragment>
                        }
                        bodyFooter={<Paging />}
                      />
                      <div className={styles.indicators}>
                        <div className="sui-layout-header indicators-header">
                          <div className="sui-layout-header__inner">
                            <h3 className={styles.indicatorsTitle}>
                              {t('Indicators')}
                            </h3>
                          </div>
                        </div>
                        {/* 
                        // @ts-ignore  */}
                        <Indicators indicatorsState={indicatorsState} />
                      </div>
                    </div>
                  </ErrorBoundary>
                </div>
              )
            }}
          </WithSearch>
        </SearchProvider>
      </div>
    </div>
  )
}
