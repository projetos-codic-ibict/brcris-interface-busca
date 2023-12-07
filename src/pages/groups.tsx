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
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useState } from 'react';
import { containsResults } from '../../utils/Utils';
import CustomSearchBox from '../components/CustomSearchBox';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import Loader from '../components/Loader';
import { CustomProvider } from '../components/context/CustomContext';
import CustomResultViewGroups from '../components/customResultView/CustomResultViewGroups';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import GroupsIndicators from '../components/indicators/GroupsIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar'])),
  },
});

const INDEX_NAME = process.env.INDEX_GROUP || '';
const configDefault: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(INDEX_NAME),
  searchQuery: {
    index: INDEX_NAME,
    operator: 'OR',
    search_fields: {
      name_text: {
        weight: 3,
      },
      keyword_text: {},
      // creationYear: {}, dá erro na busca simples por causo do tipo long
      status: {},
      'leader.name': {},
      'member.name': {},
      'orgunit.name': {},
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
  // const [config, setConfig] = useState(configDefault)
  const { t } = useTranslation('common');
  const [config, setConfig] = useState(configDefault);
  // tradução
  SORT_OPTIONS.forEach((option) => (option.name = t(option.name)));

  function updateOpetatorConfig(op: string) {
    //@ts-ignore
    setConfig({ ...config, searchQuery: { ...config.searchQuery, operator: op } });
  }

  return (
    <div>
      <Head>
        <title>{`BrCris - ${t('Research groups')}`}</title>
      </Head>
      <div className="page-search">
        <CustomProvider>
          <SearchProvider config={config}>
            <WithSearch
              mapContextToProps={({ wasSearched, results, isLoading }) => ({ wasSearched, results, isLoading })}
            >
              {({ wasSearched, results, isLoading }) => {
                return (
                  <div className="App">
                    <div className="container page">
                      <div className="page-title">
                        <h1>{t('Research Groups')}</h1>
                      </div>
                    </div>

                    <div className={styles.content}>
                      <div className={styles.searchLayout}>
                        {isLoading ? <Loader /> : ''}
                        <Layout
                          header={
                            <CustomSearchBox
                              titleFieldName="name"
                              itemLinkPrefix="group_"
                              updateOpetatorConfig={updateOpetatorConfig}
                              indexName={INDEX_NAME}
                              //@ts-ignore
                              fieldNames={Object.keys(config.searchQuery.search_fields)}
                            />
                          }
                          sideContent={
                            <ErrorBoundary className={styles.searchErrorHidden}>
                              {containsResults(wasSearched, results) && (
                                <>
                                  <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />
                                  <div className="filters">
                                    <span className="sui-sorting__label">{t('Filters')}</span>
                                  </div>
                                </>
                              )}
                              {containsResults(wasSearched, results) && (
                                <>
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
                                </>
                              )}
                            </ErrorBoundary>
                          }
                          bodyContent={
                            <ErrorBoundary
                              className={styles.searchError}
                              view={({ className, error }) => (
                                <>
                                  {error && <p className={`sui-search-error ${className}`}>{t(error.trim())}</p>}
                                  {!error && wasSearched && results.length == 0 && (
                                    <strong>{t('No documents were found for your search')}</strong>
                                  )}
                                  {!error && (
                                    <>
                                      <div className="result">
                                        <Results resultView={CustomResultViewGroups} /> <Paging />
                                      </div>
                                      <GroupsIndicators />
                                    </>
                                  )}
                                </>
                              )}
                            ></ErrorBoundary>
                          }
                          bodyHeader={
                            <ErrorBoundary className={styles.searchErrorHidden}>
                              {containsResults(wasSearched, results) && (
                                <div className="d-flex align-items-center">
                                  <PagingInfo view={CustomViewPagingInfo} />
                                </div>
                              )}
                              {containsResults(wasSearched, results) && <ResultsPerPage options={[10, 20, 50]} />}
                            </ErrorBoundary>
                          }
                          // bodyFooter={<Paging />}
                        />
                      </div>
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
