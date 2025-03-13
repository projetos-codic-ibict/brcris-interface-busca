/* eslint-disable @typescript-eslint/ban-ts-comment */

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
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { containsResults } from '../../utils/Utils';
import CustomSearchBox from '../components/CustomSearchBox';
import DownloadModal from '../components/DownloadModal';
import Loader from '../components/Loader';
import { CustomProvider } from '../components/context/CustomContext';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import Groups from '../configs/Groups';
import Institutions from '../configs/Institutions';
import Journals from '../configs/Journals';
import Patents from '../configs/Patents';
import People from '../configs/People';
import Programs from '../configs/Programs';
import Publications from '../configs/Publications';
import Softwares from '../configs/Softwares';
import styles from '../styles/Home.module.css';
import { Index } from '../types/Propos';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'advanced', 'facets'])),
  },
});

const indexes: Index[] = [Publications, People, Journals, Institutions, Patents, Programs, Groups, Softwares];

export default function App() {
  const { t } = useTranslation(['common', 'facets']);
  const router = useRouter();

  const searchParams = useSearchParams();

  const indexParam = searchParams.get('index');

  const activeIndex = indexes.find((item) => item.text === indexParam) || indexes[0];
  const [index, setIndex] = useState<Index>(activeIndex);

  // tradução
  index.sortOptions.forEach((option) => (option.name = t(option.name)));

  const updateIndexParam = () => {
    console.log('updateIndexParam');
    router.push({
      pathname: router.pathname,
      query: { ...router.query, index: index.text },
    });
  };

  const handleSelectIndex = (event: any) => {
    const selectedOption = indexes.find((item) => item.name === event.target.value);
    if (selectedOption) {
      const selectedIndex = indexes.find((item) => item.name === selectedOption.name);
      setIndex(selectedIndex!);
    }
  };

  useEffect(() => {
    updateIndexParam();
  }, [index]);

  const typeArqw = 'ris';
  return (
    <div>
      <Head>
        <title>{`BrCris - ${t(index.text)}`}</title>
      </Head>
      <div className="page-search">
        <CustomProvider>
          <SearchProvider config={index.config}>
            <WithSearch
              mapContextToProps={({ wasSearched, results, isLoading, setSearchTerm, resultSearchTerm }) => ({
                wasSearched,
                results,
                isLoading,
                setSearchTerm,
                resultSearchTerm,
              })}
            >
              {({ wasSearched, results, isLoading, setSearchTerm, resultSearchTerm }) => {
                return (
                  <div className="App">
                    <div className="container page">
                      <div className="page-title">
                        <h1>{t(index.text)}</h1>
                      </div>
                    </div>
                    <div className={styles.content}>
                      <div className={styles.searchLayout}>
                        {isLoading ? <Loader /> : ''}
                        <Layout
                          header={
                            <CustomSearchBox
                              titleFieldName="title"
                              itemLinkPrefix={index.vivoIndexPrefix}
                              setSearchTerm={setSearchTerm}
                              handleSelectIndex={handleSelectIndex}
                              indexName={index.name}
                              fieldNames={Object.keys(index.config.searchQuery.search_fields as object).concat(
                                Object.keys(index.config.searchQuery.advanced_fields || ([] as object))
                              )}
                            />
                          }
                          sideContent={
                            <ErrorBoundary className={styles.searchErrorHidden}>
                              {containsResults(wasSearched, results) && (
                                <>
                                  <Sorting label={t('Sort by') || ''} sortOptions={index.sortOptions} />
                                  <div className="filters">
                                    <span className="sui-sorting__label">{t('Filters')}</span>
                                  </div>
                                </>
                              )}
                              {containsResults(wasSearched, results) && (
                                <>
                                  {Object.keys(index.config.searchQuery.facets!).map((facet, i) => (
                                    <Facet key={i} field={facet} label={t(facet.toLowerCase(), { ns: 'facets' })} />
                                  ))}
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
                                  {!error && wasSearched && results.length == 0 && resultSearchTerm && (
                                    <strong>{t('No documents were found for your search')}</strong>
                                  )}
                                  {!error && (
                                    <>
                                      <div className="result">
                                        <Results resultView={index.customView} /> <Paging />
                                      </div>
                                      <index.indicators />
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

                              {containsResults(wasSearched, results) && (
                                <div className="d-flex gap-2  align-items-center">
                                  {
                                    <>
                                      <ResultsPerPage options={[10, 20, 50]} />
                                      {/* @ts-ignore */}
                                      <DownloadModal typeArq={typeArqw} />
                                      <DownloadModal />{' '}
                                    </>
                                  }
                                </div>
                              )}
                            </ErrorBoundary>
                          }
                          // bodyFooter={}
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
