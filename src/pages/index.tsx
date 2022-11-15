/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
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
import { Layout } from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import Navbar from '../components/Navbar'
import Indicators from '../components/Indicators/Index'
import ClearFilters from '../components/ClearFilters'

const connector = new Connector()

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  hasA11yNotifications: true,
  apiConnector: connector,
  searchQuery: {
    searchQuery: {
      'title.keyword': {
        weight: 3,
      },
      author: {},
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
      'publicationDate.keyword': { type: 'value', size: 100 },
      'author.name.keyword': { type: 'value' },
      'keyword.keyword': { type: 'value' },
      'type.keyword': { type: 'value' },
      'orgunit.name.keyword': { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      search_fields: {
        'titlesuggest.suggest': {},
      },
      resultsPerPage: 5,
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
        documents: {
          fields: ['suggest'],
        },
      },
      size: 4,
    },
  },
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
  return (
    <div>
      <Navbar />
      <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
          {({ wasSearched }) => {
            return (
              <div className="App">
                <ErrorBoundary>
                  <div className="container">
                    <SearchBox
                      autocompleteMinimumCharacters={3}
                      autocompleteResults={{
                        linkTarget: '_blank',
                        sectionTitle: 'Results',
                        titleField: 'title',
                        urlField: 'vivo_link',
                        shouldTrackClickThrough: true,
                        clickThroughTags: ['test'],
                      }}
                      searchAsYouType={true}
                      autocompleteSuggestions={true}
                      debounceLength={500}
                    />
                  </div>
                  <div className={styles.content}>
                    <Layout
                      header={<ClearFilters />}
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
                          />
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
                      <Indicators />
                    </div>
                  </div>
                </ErrorBoundary>
              </div>
            )
          }}
        </WithSearch>
      </SearchProvider>
    </div>
  )
}

const CustomResultView = ({
  result,
  onClickLink,
}: {
  result: any
  onClickLink: () => void
}) => (
  <li className="sui-result">
    <div className="sui-result__header">
      <h6>
        <a target="_blank" href={result.vivo_link.raw} rel="noreferrer">
          {result.title.raw}
        </a>
      </h6>
    </div>
    <div className="sui-result__body">
      <ul className="sui-result__details">
        <li>
          <span className="sui-result__key">Ano:</span>
          <span className="sui-result__value">
            {result.publicationDate?.raw}
          </span>
          <br />

          <span className="sui-result__key">Autor(es): </span>
          <span className="sui-result__value">
            {result.author?.raw.map((author: any) => (
              <>
                <a
                  key={author.id}
                  target="_blank"
                  href={`https://brcris.ibict.br/vivo/display/pers_${author.id}`}
                  rel="noreferrer"
                >
                  {author.name}
                </a>
                <br />
              </>
            ))}
          </span>

          <span className="sui-result__key">OrgUnit:</span>
          <span className="sui-result__value">
          {result.orgunit?.raw.map((org: any) => (
              <>
                {org.name}
              </>
            ))}
          </span>
          <br />

          <span className="sui-result__key">Tipo:</span>
          <span className="sui-result__value">{result.type.raw}</span>
          <br />

          <span className="sui-result__key">Revista: </span>
          <span className="sui-result__value">
            {result.journal?.raw.map((journal: any) => (
              <>
                {journal.title ? journal.title : journal}
              </>
            ))}
          </span>
        </li>
      </ul>
    </div>
  </li>
)
