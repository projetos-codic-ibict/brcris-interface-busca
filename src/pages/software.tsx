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
} from '@elastic/react-search-ui';
import { Layout } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import React from 'react';
import ButtonFieldSelect from '../components/ButtonFieldSelect';
import ClearFilters from '../components/ClearFilters';
import CustomResultViewPeople from '../components/customResultView/CustomResultViewPeople';
import IndicatorsPeople from '../components/indicators/PeopleIndicators';
import Connector from '../services/APIConnector';
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

const connector = new Connector();

const config = {
  debug: true,
  urlPushDebounceLength: 500,
  alwaysSearchOnInitialLoad: true,
  hasA11yNotifications: true,
  apiConnector: connector,
  searchQuery: {
    index: 'pesqdf-person',
    track_total_hits: true,
    operator: 'OR',
    search_fields: {
      name: {},
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

const indicatorsState = {
  config,
  data: [],
};

export default function App() {
  // const [config, setConfig] = useState(configDefault)
  const { t } = useTranslation('common');
  // tradução
  SORT_OPTIONS.forEach((option) => (option.name = t(option.name)));
  return (
    <div>
      <Head>
        <title>{`BrCris - ${t('People')}`}</title>
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
                            <h2>{t('People')}</h2>
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
                                    title={t('Nome')}
                                    active={true}
                                    config={config}
                                    searchField="name"
                                  />
                                </li>
                                <li className="nav-item" role="presentation">
                                  <ButtonFieldSelect
                                    title={t('Research field')}
                                    active={false}
                                    config={config}
                                    searchField="researchArea"
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
                                            className="form-control search-box"
                                            type="text"
                                            value={value}
                                            onChange={(e) =>
                                              onChange(e.target.value)
                                            }
                                          />
                                        </div>
                                        <div className="col-auto">
                                          <input
                                            className="btn btn-primary search-btn"
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
                                {t('Filters')}
                              </span>
                            </div>
                            <Facet
                              key={'1'}
                              field={'nationality'}
                              label={t('Nationality')}
                            />
                            <Facet
                              key={'2'}
                              field={'researchArea'}
                              label={t('Research field')}
                            />
                          </div>
                        }
                        bodyContent={
                          <Results resultView={CustomResultViewPeople} />
                        }
                        bodyHeader={
                          <React.Fragment>
                            {wasSearched && <PagingInfo />}
                            {wasSearched && <ResultsPerPage />}
                          </React.Fragment>
                        }
                        bodyFooter={<Paging />}
                      />
                      <div className={styles.Indicators}>
                        <div className="sui-layout-header">
                          <div className="sui-layout-header__inner"></div>
                        </div>
                        {/** 
                        // @ts-ignore */}
                        <IndicatorsPeople indicatorsState={indicatorsState} />
                      </div>
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