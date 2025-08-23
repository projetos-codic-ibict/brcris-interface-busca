import Loader from '../Loader';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';

export default function PublicationDetails() {
  const { wasSearched, isLoading, results } = useSearch();

  return (
    <div className="">
      {isLoading && <Loader />}
      <ErrorBoundary>
        {wasSearched &&
          results &&
          results.length > 0 &&
          results.map((result, index) => (
            <div key={index}>
              <div className="br-card">
                <div className="card-content">
                  <h3 className="title">{result.title?.raw}</h3>
                </div>
              </div>
            </div>
          ))}
      </ErrorBoundary>
    </div>
  );
}
