import Loader from '../Loader';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

export default function PublicationDetails() {
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
              <h1 className="title">{result.title?.raw}</h1>
              <ul>
                <ShowAuthorItem label={t('Author')} authors={result.author?.raw} />
                <ShowItem label={t('Year')} value={result.publicationDate?.raw} />
                <ShowItem label={t('Type')} value={result.type?.raw} />
              </ul>
            </div>
          ))}
      </ErrorBoundary>
    </div>
  );
}
