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
import React from 'react';
import ClearFilters from '../components/ClearFilters';
import CustomResultViewJournals from '../components/customResultView/CustomResultViewJournals';
import Connector from '../services/APIConnector';
import styles from '../styles/Home.module.css';
// import OperatorSelect from '../components/OperatorSelect'
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import JornalsIndicators from '../components/indicators/JornalsIndicators';
type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

const INDEX_NAME = 'pesqdf-journals';
const connector = new Connector(INDEX_NAME);

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
      'title-text': {},
    },
    result_fields: {
      id: {
        raw: {},
      },
      title: {
        raw: {},
      },
      issn: {
        raw: {},
      },
      issnl: {
        raw: {},
      },
      status: {
        raw: {},
      },
      publisher: {
        raw: [],
      },
    },
    disjunctiveFacets: ['status', 'publisher.name'],

    facets: {
      // 'publicationDate.keyword': { type: 'value', size: 100 },
      status: { type: 'value' },
      'publisher.name': { type: 'value' },
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
    name: 'Title ASC',
    value: [
      {
        field: 'title',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Title DESC',
    value: [
      {
        field: 'title',
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
        <title>{`BrCris - ${t('Journals')}`}</title>
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
                        <h2>{t('Journals')}</h2>
                      </div>
                    </div>

                    <div className={styles.content}>
                      <Layout
                        header={
                          <SearchBox
                            autocompleteMinimumCharacters={3}
                            autocompleteResults={{
                              linkTarget: '_blank',
                              sectionTitle: t('Open link') || '',
                              titleField: 'title',
                              urlField: 'vivo_link',
                              shouldTrackClickThrough: true,
                            }}
                            autocompleteSuggestions={false}
                            debounceLength={0}
                          />
                        }
                        sideContent={
                          <div>
                            {wasSearched && <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />}
                            <div className="filters">
                              <span className="sui-sorting__label">{t('Filters')}</span>
                            </div>
                            <Facet key={'1'} field={'status'} label={t('Status')} />
                            <Facet key={'2'} field={'publisher.name'} label={t('Publisher')} />
                          </div>
                        }
                        bodyContent={<Results resultView={CustomResultViewJournals} />}
                        bodyHeader={
                          <React.Fragment>
                            {wasSearched && (
                              <div className="d-flex align-items-center">
                                <PagingInfo />
                                <ClearFilters />
                              </div>
                            )}
                            {wasSearched && <ResultsPerPage />}
                          </React.Fragment>
                        }
                        bodyFooter={<Paging />}
                      />
                      <div className={styles.indicators}>
                        {/** 
                        // @ts-ignore */}
                        <JornalsIndicators indicatorsState={indicatorsState} />
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
