import React from 'react'
import Connector from '../services/APIConnector'

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

const connector = new Connector()

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  hasA11yNotifications: true,
  apiConnector: connector,
  searchQuery: {
    searchQuery: {
      filters: [],
      search_fields: {
        Título: {},
      },
    },
    result_fields: {
      Título: {
        snippet: {},
      },
      Ano: {
        snippet: {},
      },
      autores: {
        raw: {},
      },
      Instituição: {
        snippet: {},
      },
      Revista: {
        snippet: {},
      },
    },
    disjunctiveFacets: ['autores', 'Instituição', 'Ano'],
    facets: {
      Ano: { type: 'value' },
      autores: { type: 'value', sort: 'count' },
      Instituição: { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      search_fields: {
        Revista: {},
      },
      resultsPerPage: 5,
      result_fields: {
        Revista: {
          snippet: {
            size: 100,
            fallback: true,
          },
        },
      },
    },
    suggestions: {
      types: {
        documents: {
          fields: ['sugestao'],
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
        field: 'Ano',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Ano DESC',
    value: [
      {
        field: 'Ano',
        direction: 'desc',
      },
    ],
  },
]

export default function App() {
  return (
    <div>
      <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
          {({ wasSearched }) => {
            return (
              <div className="App">
                <ErrorBoundary>
                  <Layout
                    header={
                      <SearchBox
                        autocompleteMinimumCharacters={3}
                        autocompleteResults={{
                          linkTarget: '_blank',
                          sectionTitle: 'Results',
                          titleField: 'Título',
                          urlField: '',
                          shouldTrackClickThrough: true,
                          clickThroughTags: ['test'],
                        }}
                        autocompleteSuggestions={true}
                        debounceLength={0}
                      />
                    }
                    sideContent={
                      <div>
                        {wasSearched && (
                          <Sorting
                            label={'Sort by'}
                            sortOptions={SORT_OPTIONS}
                          />
                        )}
                        <Facet key={'1'} field={'Ano'} label={'ano'} />
                        <Facet key={'3'} field={'autores'} label={'autores'} />
                        <Facet
                          key={'2'}
                          field={'Instituição'}
                          label={'instituição'}
                        />
                      </div>
                    }
                    bodyContent={<Results />}
                    bodyHeader={
                      <React.Fragment>
                        {wasSearched && <PagingInfo />}
                        {wasSearched && <ResultsPerPage />}
                      </React.Fragment>
                    }
                    bodyFooter={<Paging />}
                  />
                </ErrorBoundary>
              </div>
            )
          }}
        </WithSearch>
      </SearchProvider>
    </div>
  )
}
