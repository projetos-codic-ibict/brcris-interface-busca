import Loader from '../Loader';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import Head from 'next/head';
import ShowItem from '../customResultView/ShowItem';

export default function ProgramDetails() {
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
                <title>{`${result.name?.raw} | BrCris`}</title>
              </Head>
              <h1 className="title">{result.name?.raw}</h1>
              <ul>
                <ShowItem
                  label={t('Research field')}
                  value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                    <span key={index}>{researchArea.name}</span>
                  ))}
                />
                <ShowItem label={t('Evaluation area')} value={result.evaluationArea?.raw} />
              </ul>
            </div>
          ))}
      </ErrorBoundary>
    </div>
  );
}
