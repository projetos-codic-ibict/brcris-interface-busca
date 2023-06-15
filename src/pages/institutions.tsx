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
import CustomResultViewInstitutions from '../components/customResultView/CustomResultViewInstitutions';
import OrgUnitIndicators from '../components/indicators/OrgUnitIndicators';
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
    index: 'pesqdf-orgunit',
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
      address: {
        raw: {},
      },
    },
    facets: {
      address: { type: 'value' },
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
        <title>{`BrCris - ${t('Institutions')}`}</title>
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
                            <h2>{t('Institutions')}</h2>
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
                                    searchField="name"
                                  />
                                </li>
                                <li className="nav-item" role="presentation">
                                  <ButtonFieldSelect
                                    title={t('Address')}
                                    active={false}
                                    config={config}
                                    searchField="address"
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
                              field={'address'}
                              label={t('Address')}
                            />
                          </div>
                        }
                        bodyContent={
                          <Results resultView={CustomResultViewInstitutions} />
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
                        <div className="sui-layout-header">
                          <div className="sui-layout-header__inner"></div>
                        </div>
                        {/** 
                        // @ts-ignore */}
                        <OrgUnitIndicators indicatorsState={indicatorsState} />
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
