import Loader from '../Loader';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import Head from 'next/head';
import ShowAuthorItem from '../customResultView/ShowAuthorItem';
import ShowItem from '../customResultView/ShowItem';
import ExternalLink from '../externalLinks';
import { OrgUnit } from '../../types/Entities';
import { useRouter } from 'next/router';

export default function PatentDetails() {
  const { wasSearched, isLoading, results } = useSearch();
  const { t } = useTranslation('common');
  const router = useRouter();

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
                <title>{`${result.espacenetTitle?.raw} | BrCris`}</title>
              </Head>
              <h1 className="title">{result.espacenetTitle?.raw}</h1>
              <ul>
                <ShowAuthorItem label={t('Inventor(s)')} authors={result.inventor?.raw} />
                {result.applicant === undefined ? null : (
                  <li>
                    <span className="sui-result__key">{t('Applicant')}</span>
                    {result.applicant?.raw.map((applicant: OrgUnit, index: number) => (
                      <span key={index} className="sui-result__value">
                        <ExternalLink
                          key={applicant.id}
                          content={applicant.name!}
                          url={`/organizations${applicant.id}?lang=${router.locale}`}
                        />
                      </span>
                    ))}
                  </li>
                )}
                <ShowItem label={t('Deposit date')} value={result.depositDate?.raw} />
                <ShowItem label={t('Kind Code')} value={result.kindCode?.raw} />
                <ShowItem label={t('Country Code')} value={result.countryCode?.raw} />
                <ShowItem label={t('Lattes Title')} value={result.lattesTitle?.raw} />
                <ShowItem label={t('Publication date')} value={result.publicationDate?.raw} />
              </ul>
            </div>
          ))}
      </ErrorBoundary>
    </div>
  );
}
