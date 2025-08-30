import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import ShowItem from '../customResultView/ShowItem';
import Loader from '../Loader';

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
                <li>
                  <span className="sui-result__key">{t('Organization')}</span>
                  <span className="sui-result__value">
                    {result.orgunit?.raw.map((org: OrgUnit) => (
                      <a key={org.id} href={`/organizations/${org.id}`}>
                        {org.name!}
                      </a>
                    ))}
                  </span>
                </li>
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
