/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import Connector from '../services/APIConnector'
import styles from '../styles/Home.module.css'
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch,
} from '@elastic/react-search-ui'
import { SearchDriverOptions } from '@elastic/search-ui'
import { Layout } from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import Navbar from '../components/Navbar'
import Indicators from '../components/Indicators'
import ClearFilters from '../components/ClearFilters'
import CustomResultView from '../components/CustomResultView'
import ButtonFieldSelect from '../components/ButtonFieldSelect'
import OperatorSelect from '../components/OperatorSelect'

const connector = new Connector()

const config = {
  debug: true,
  urlPushDebounceLength: 500,
  alwaysSearchOnInitialLoad: true,
  hasA11yNotifications: true,
  apiConnector: connector,
  searchQuery: {
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
      vivo_link: {
        raw: {},
      },
    },
    disjunctiveFacets: [
      'author.name.keyword',
      'keyword.keyword',
      'publicationDate.keyword',
    ],
    facets: {
      // 'publicationDate.keyword': { type: 'value', size: 100 },
      'author.name.keyword': { type: 'value' },
      'keyword.keyword': { type: 'value' },
      'type.keyword': { type: 'value' },
      'orgunit.name.keyword': { type: 'value' },
      'publicationDate.keyword': {
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

const SORT_OPTIONS = [
  {
    name: 'Relevance',
    value: [],
  },
  {
    name: 'Ano ASC',
    value: [
      {
        field: 'publicationDate.keyword',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Ano DESC',
    value: [
      {
        field: 'publicationDate.keyword',
        direction: 'desc',
      },
    ],
  },
]

export default function App() {
  // const [config, setConfig] = useState(configDefault)

  return (
    <div>
      <Navbar />
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
                        <div className="col-md-6"></div>

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
                                    title="Título"
                                    active="true"
                                    config={config}
                                    searchField="title"
                                  />
                                </li>
                                <li className="nav-item" role="presentation">
                                  <ButtonFieldSelect
                                    title="Autor"
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
                                        className="row g-3 mb-5"
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
                                            value="Pesquisar"
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
                                label={'Sort by'}
                                sortOptions={SORT_OPTIONS}
                              />
                            )}
                            {/* <Facet key={'1'} field={'Ano'} label={'ano'} /> */}
                            <Facet
                              key={'1'}
                              field={'author.name.keyword'}
                              label={'autores'}
                            />
                            <Facet
                              key={'2'}
                              field={'keyword.keyword'}
                              label={'Palavra-chave'}
                            />
                            <Facet
                              key={'3'}
                              field={'orgunit.name.keyword'}
                              label={'Insituição'}
                            />
                            <Facet
                              key={'4'}
                              field={'type.keyword'}
                              label={'Tipo'}
                            />
                            <Facet
                              key={'5'}
                              field={'publicationDate.keyword'}
                              filterType={'none'}
                              label={'Ano'}
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
                        bodyContent={<Results resultView={CustomResultView} />}
                        bodyHeader={
                          <React.Fragment>
                            {wasSearched && <PagingInfo />}
                            {wasSearched && <ResultsPerPage />}
                          </React.Fragment>
                        }
                        bodyFooter={<Paging />}
                      />
                      <div className={styles.indicators}>
                        <div className="sui-layout-header">
                          <div className="sui-layout-header__inner"></div>
                        </div>
                        <Indicators config={config} />
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
