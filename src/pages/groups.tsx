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
import ClearFilters from '../components/ClearFilters';
import Connector from '../services/APIConnector';
import styles from '../styles/Home.module.css';

import CustomResultViewGroups from '../components/customResultView/CustomResultViewGroups';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import GroupsIndicators from '../components/indicators/GroupsIndicators';
type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

const INDEX_NAME = 'researchgroups';
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
      name: {},
    },
    result_fields: {
      name: {
        raw: {},
      },
      creationYear: {
        raw: {},
      },
      researchLine: {
        raw: {},
      },
      knowledgeArea: {
        raw: {},
      },
      description: {
        raw: {},
      },
      applicationSector: {
        raw: {},
      },
      keyword: {
        raw: [],
      },
      URL: {
        raw: {},
      },
      status: {
        raw: {},
      },
      leader: {
        raw: {},
      },
      partner: {
        raw: {},
      },
      member: {
        raw: {},
      },
      orgunit: {
        raw: {},
      },
      software: {
        raw: {},
      },
      equipment: {
        raw: {},
      },
    },
    disjunctiveFacets: [
      'creationYear',
      'researchLine',
      'knowledgeArea',
      'orgunit',
      'keyword',
      'status',
      'leader',
      'partner',
      'member',
      'applicationSector',
    ],
    facets: {
      creationYear: { type: 'value' },
      researchLine: { type: 'value' },
      knowledgeArea: { type: 'value' },
      'orgunit.name': { type: 'value' },
      keyword: { type: 'value' },
      status: { type: 'value' },
      'leader.name': { type: 'value' },
      'partner.name': { type: 'value' },
      member: { type: 'value' },
      applicationSector: { type: 'value' },
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
        <title>{`BrCris - ${t('Research groups')}`}</title>
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
                        <h2>{t('Research Groups')}</h2>
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
                              titleField: 'name',
                              urlField: 'vivo_link',
                              shouldTrackClickThrough: true,
                            }}
                            autocompleteSuggestions={true}
                            debounceLength={0}
                          />
                        }
                        sideContent={
                          <div>
                            {wasSearched && <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />}
                            <div className="filters">
                              <span className="sui-sorting__label">{t('Filters')}</span>
                            </div>
                            <Facet key={'1'} field={'creationYear'} label={t('Creation year')} />

                            <Facet key={'2'} field={'researchLine'} label={t('Research line')} />

                            <Facet key={'3'} field={'knowledgeArea'} label={t('Knowledge area')} />

                            <Facet key={'4'} field={'orgunit.name'} label={t('Organization')} />

                            <Facet key={'5'} field={'keyword'} label={t('Keyword')} />

                            <Facet key={'6'} field={'status'} label={t('Status')} />

                            <Facet key={'7'} field={'leader.name'} label={t('Leader')} />

                            <Facet key={'8'} field={'partner.name'} label={t('Partner')} />

                            <Facet key={'9'} field={'member'} label={t('Member')} />

                            <Facet key={'10'} field={'applicationSector'} label={t('Application sector')} />
                          </div>
                        }
                        bodyContent={<Results resultView={CustomResultViewGroups} />}
                        bodyHeader={
                          <React.Fragment>
                            {wasSearched && (
                              <div className="d-flex align-items-center">
                                <PagingInfo view={CustomViewPagingInfo} />
                                <ClearFilters />
                              </div>
                            )}
                            {wasSearched && <ResultsPerPage options={[10, 20, 50]} />}
                          </React.Fragment>
                        }
                        bodyFooter={<Paging />}
                      />
                      <div className={styles.Indicators}>
                        {/** 
                        // @ts-ignore */}
                        <GroupsIndicators indicatorsState={indicatorsState} />
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
