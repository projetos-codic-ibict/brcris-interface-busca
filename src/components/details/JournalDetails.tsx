import Loader from '../Loader';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import Head from 'next/head';
import ShowAuthorItem from '../customResultView/ShowAuthorItem';
import ShowItem from '../customResultView/ShowItem';

export default function JournalsDetails() {
  const { wasSearched, isLoading, results } = useSearch();
  const { t } = useTranslation('common');

  return (
    <div className="">
      {isLoading && <Loader />}
      <ErrorBoundary>
        {wasSearched &&
          results &&
          results.length > 0 &&
          results.map((result, index) => (
            <div key={index}>
              <Head>
                <title>{`${result.title?.raw} | BrCris`}</title>
              </Head>
              <h1 className="title">{result.title?.raw}</h1>
              <ul>
                    <ShowItem label={t('Qualis')} value={result.qualis?.raw} />
                    <ShowItem label={t('H5index')} value={result.H5index?.raw} />
                    <ShowItem label={t('Type')} value={result.type?.raw} />
                    <ShowItem label={t('ISSN')} value={result.issn?.raw} />
                    <ShowItem label={t('ISSN-L')} value={result.issnl?.raw} />
                    <ShowItem label={t('Access type')} value={result.accessType?.raw} />
                    <ShowItem label={t('Status')} value={result.status?.raw} />
                    <ShowAuthorItem label={t('Publisher')} authors={result.publisher?.raw} />
                    <ShowItem label={t('Keywords')} value={result.keywords?.raw} />
                    <ShowItem
                    label={t('Research field')}
                    value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                        <span key={index}>{researchArea.name}</span>
                    ))}
                    />
              </ul>
            </div>
          ))}
      </ErrorBoundary>
    </div>
  );
}
