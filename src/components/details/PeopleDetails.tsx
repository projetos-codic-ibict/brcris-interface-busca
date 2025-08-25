import Loader from '../Loader';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import Head from 'next/head';
import ExternalLink from '../externalLinks';
import LattesLink from '../externalLinks/LattesLink';
import ShowItem from '../customResultView/ShowItem';
import PersonProduction from './PersonProduction';

export default function PublicationDetails() {
  const { wasSearched, isLoading, results } = useSearch();
  const { t } = useTranslation('common');

  return (
    <>
      {isLoading && <Loader />}
      <ErrorBoundary>
        {wasSearched &&
          results &&
          results.length > 0 &&
          results.map((result, index) => (
            <div className="details-content" key={index}>
              <div className="details-main">
                <Head>
                  <title>{`${result.name?.raw} | BrCris`}</title>
                </Head>
                <h1>
                  {result.name?.raw}
                  {result.lattesId ? <LattesLink lattesId={result.lattesId!} /> : ''}
                </h1>
                <ul>
                  <ShowItem label={t('Nationality')} value={result.nationality?.raw} />
                  <ShowItem
                    label={t('Orcid')}
                    value={
                      result.orcid
                        ? result.orcid?.raw.toString().startsWith('https')
                          ? result.orcid?.raw
                          : `https://orcid.org/${result.orcid?.raw}`
                        : ''
                    }
                    urlLink={
                      result.orcid
                        ? result.orcid?.raw.toString().startsWith('https')
                          ? result.orcid?.raw
                          : `https://orcid.org/${result.orcid?.raw}`
                        : ''
                    }
                  />

                  <ShowItem
                    label={t('Organization')}
                    value={result.orgunit?.raw.map((orgunit: any, index: any) => (
                      <span key={index} className="sui-result__value">
                        <ExternalLink key={orgunit.id} content={orgunit.name!} url={`/org_${orgunit.id}?lang=`} />
                      </span>
                    ))}
                  />
                  <ShowItem
                    label={t('Research field')}
                    value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                      <span key={index}>{researchArea.name}</span>
                    ))}
                  />
                  <li>
                    <span className="sui-result__key">{t('Community')}</span>
                    <span className="sui-result__value">
                      {result.community?.raw.map((community: any, index: any) => (
                        <span key={index}>{community.name}</span>
                      ))}
                    </span>
                  </li>
                </ul>
              </div>
              <PersonProduction authorId={result.id?.raw} />
            </div>
          ))}
      </ErrorBoundary>
    </>
  );
}
