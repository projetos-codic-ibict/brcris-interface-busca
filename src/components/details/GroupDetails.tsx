import Loader from '../Loader';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import Head from 'next/head';
import ReadMoreCollapse from '../ReadMoreCollapse';
import ShowAuthorItem from '../customResultView/ShowAuthorItem';
import ShowItem from '../customResultView/ShowItem';

export default function GroupDetails() {
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
                <ShowItem label={t('Creation year')} value={result.creationYear?.raw} />
                <ShowItem label={t('Research line')} value={result.researchLine?.raw} />
                <ShowAuthorItem label={t('Leader')} authors={result.leader?.raw} />
                {result.orgunit && (
                  <li>
                    <span className="sui-result__key">{t('Organization')}</span>
                    {result.orgunit?.raw.map((orgunit: any, index: any) => (
                      <span key={index} className="sui-result__value">
                        <a key={orgunit.id} href={`/organizations/${orgunit.id}`}>
                          {orgunit.name!}
                        </a>
                      </span>
                    ))}
                  </li>
                )}
                {result.partner && (
                  <li>
                    <span className="sui-result__key">{t('Partner')}</span>
                    {result.partner?.raw.map((partner: any, index: any) => (
                      <span key={index} className="sui-result__value">
                        <a key={partner.id} href={`/organizations/${partner.id}`}>
                          {partner.name!}
                        </a>
                      </span>
                    ))}
                  </li>
                )}
                <ShowItem label={t('URL')} value={result.URL?.raw} urlLink={result.URL?.raw} />
                <ShowItem label={t('Status')} value={result.status?.raw} />
                <ShowItem label={t('Application sector')} value={result.applicationSector?.raw} />

                <ReadMoreCollapse id={result.id?.raw}>
                  <ShowAuthorItem label={t('Member')} authors={result.member?.raw} />
                  <ShowItem label={t('Knowledge area')} value={result.knowledgeArea?.raw} />
                  <ShowItem label={t('Keywords')} value={result.keyword?.raw} />
                  <ShowItem label={t('Software')} value={result.software?.raw} />
                  <ShowItem label={t('Equipment')} value={result.equipment?.raw} />
                  <ShowItem label={t('Description')} value={result.description?.raw} />
                </ReadMoreCollapse>
              </ul>
            </div>
          ))}
      </ErrorBoundary>
    </div>
  );
}
