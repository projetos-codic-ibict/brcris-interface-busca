import Loader from '../Loader';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import Head from 'next/head';
import ReadMoreCollapse from '../ReadMoreCollapse';
import ShowAuthorItem from '../customResultView/ShowAuthorItem';
import ShowItem from '../customResultView/ShowItem';

export default function SoftwareDetails() {
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
                <ShowItem label={t('Description')} value={result.description?.raw} />
                <ShowAuthorItem label={t('Creator(s)')} authors={result.creator?.raw} />
                <ShowItem label={t('Release year')} value={result.releaseYear?.raw} />
                <ShowItem label={t('Registration country')} value={result.registrationCountry?.raw} />
                <ShowItem label={t('Platform')} value={result.platform?.raw} />
                <ShowItem label={t('Kind')} value={result.kind?.raw} />

                <ReadMoreCollapse id={result.id?.raw}>
                  <ShowItem label={t('Deposit date')} value={result.depositDate?.raw} />
                  <ShowItem label={t('Activity sector')} value={result.activitySector?.raw} />
                  <ShowItem label={t('Knowledge areas')} value={result.knowledgeAreas?.raw} />
                  <ShowItem label={t('Keywords')} value={result.keyword?.raw} />
                  <ShowItem label={t('Language')} value={result.language?.raw} />
                </ReadMoreCollapse>
              </ul>
            </div>
          ))}
      </ErrorBoundary>
    </div>
  );
}
