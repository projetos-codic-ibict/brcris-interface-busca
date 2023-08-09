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
import { useState } from 'react';
import ClearFilters from '../components/ClearFilters';
import CustomResultViewJournals from '../components/customResultView/CustomResultViewJournals';
import Connector from '../services/APIConnector';
import styles from '../styles/Home.module.css';
// import OperatorSelect from '../components/OperatorSelect'
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import CustomSearchBox from '../components/CustomSearchBox';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
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

const configDefault = {
  debug: true,
  urlPushDebounceLength: 500,
  alwaysSearchOnInitialLoad: true,
  hasA11yNotifications: true,
  apiConnector: connector,
  searchQuery: {
    track_total_hits: true,
    operator: 'OR',
    search_fields: {
      title_text: {},
    },
    result_fields: {
      id: {
        raw: {},
      },
      title: {
        raw: {},
      },
      accessType: {
        raw: {},
      },
      issn: {
        raw: {},
      },
      issnl: {
        raw: {},
      },
      keywords: {
        raw: {},
      },
      status: {
        raw: {},
      },
      qualis: {
        raw: {},
      },
      type: {
        raw: {},
      },
      H5index: {
        raw: {},
      },
      publisher: {
        raw: [],
      },
    },
    disjunctiveFacets: ['status', 'publisher.name'],

    facets: {
      qualis: { type: 'value' },
      status: { type: 'value' },
      type: { type: 'value' },
      'publisher.name': { type: 'value' },
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

export default function App() {
  // const [config, setConfig] = useState(configDefault)
  const { t } = useTranslation('common');
  // tradução
  SORT_OPTIONS.forEach((option) => (option.name = t(option.name)));

  const [config, setConfig] = useState(configDefault);

  function updateOpetatorConfig(op: string) {
    setConfig({ ...config, searchQuery: { ...config.searchQuery, operator: op } });
  }

  const [indicatorsState, setIndicatorsState] = useState({
    config,
    data: [],
  });

  const receiveChildData = (data: any) => {
    setIndicatorsState(data);
  };

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
                          <CustomSearchBox
                            titleFieldName="title"
                            itemLinkPrefix="journ_"
                            updateOpetatorConfig={updateOpetatorConfig}
                          />
                        }
                        sideContent={
                          <div>
                            {wasSearched && <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />}
                            <div className="filters">
                              <span className="sui-sorting__label">{t('Filters')}</span>
                            </div>
                            <Facet key={'1'} field={'qualis'} label={t('Qualis')} />
                            <Facet key={'2'} field={'status'} label={t('Status')} />
                            <Facet key={'3'} field={'type'} label={t('Type')} />
                            <Facet key={'4'} field={'publisher.name'} label={t('Publisher')} />
                          </div>
                        }
                        bodyContent={<Results resultView={CustomResultViewJournals} />}
                        bodyHeader={
                          <>
                            {wasSearched && (
                              <div className="d-flex align-items-center">
                                <PagingInfo view={CustomViewPagingInfo} />
                                <ClearFilters />
                              </div>
                            )}
                            {wasSearched && <ResultsPerPage options={[10, 20, 50]} />}
                          </>
                        }
                        bodyFooter={<Paging />}
                      />
                      <div className={styles.indicators}>
                        {/** 
                        // @ts-ignore */}
                        <JornalsIndicators indicatorsState={indicatorsState} sendDataToParent={receiveChildData} />
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
