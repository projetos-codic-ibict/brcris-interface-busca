import Loader from '../Loader';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, useSearch } from '@elastic/react-search-ui';
import Head from 'next/head';
import ShowAuthorItem from '../customResultView/ShowAuthorItem';
import ShowItem from '../customResultView/ShowItem';
import ExternalLink from '../externalLinks';
import { OrgUnit, Service } from '../../types/Entities';

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
              <Head>
                <title>{`${result.title?.raw} | BrCris`}</title>
              </Head>
              <h1 className="title">{result.title?.raw}</h1>
              <ul>
                <ShowAuthorItem label={t('Author')} authors={result.author?.raw} />
                <ShowItem label={t('Year')} value={result.publicationDate?.raw} />
                <ShowItem label={t('Type')} value={result.type?.raw} />
                {result.orgunit === undefined && result.service === undefined && result.journal === undefined ? null : (
                  <li>
                    <span className="sui-result__key">
                      {result.type?.raw == 'doctoral thesis' || result.type?.raw == 'master thesis'
                        ? `${t('Organization')}`
                        : result.type?.raw == 'conference proceedings'
                          ? `${t('Organization')}`
                          : `${t('Journals')}`}
                    </span>
                    <span className="sui-result__value">
                      {result.orgunit?.raw.map((org: OrgUnit) => (
                        <ExternalLink key={org.id} content={org.name!} url={`/org_${org.id}?lang=`} />
                      ))}

                      {result.service?.raw.map((service: Service) =>
                        service.title?.map((title: string) => (
                          <ExternalLink key={title} content={title} url={`/serv_${service.id}?lang=`} />
                        ))
                      )}

                      {result.journal?.raw.map((journal: any, index: any) => (
                        <ExternalLink
                          key={index}
                          content={journal.title ? journal.title : journal}
                          url={`/journals/${journal.id}?lang=`}
                        />
                      ))}
                    </span>
                  </li>
                )}

                <ShowItem label={t('Language')} value={result.language?.raw} />

                <ShowItem label={t('Keywords')} value={result.keyword?.raw} />
                <ShowAuthorItem label={t('Advisor')} authors={result.advisor?.raw} />
                <ShowAuthorItem label={t('Coadvisor')} authors={result.coadvisor?.raw} />
                {/* <ShowItem label={t('Year 2')} value={result.year?.raw} /> */}
                <ShowItem label={t('DOI')} value={result.doi?.raw} />
                <ShowItem label={t('OpenalexId')} value={result.openalexId?.raw} />

                <ShowItem
                  label={t('Research field')}
                  value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                    <span key={index}>{researchArea.name}</span>
                  ))}
                />
                <ShowItem
                  label={t('Conference')}
                  value={result.conference?.raw.map((conference: any, index: any) => (
                    <span key={index}>{conference.name}</span>
                  ))}
                />

                <ShowItem
                  label={t('Program')}
                  value={result.program?.raw.map((program: any, index: any) => (
                    <span key={index} className="sui-result__value">
                      <ExternalLink key={program.id} content={program.name!} url={`programs/${program.id}?lang=`} />
                    </span>
                  ))}
                />
                <ShowItem
                  label={t('Course')}
                  value={result.course?.raw.map((course: any, index: any) => (
                    <span key={index} className="sui-result__value">
                      <ExternalLink key={course.id} content={course.name!} url={`/org_${course.id}?lang=`} />
                    </span>
                  ))}
                />
              </ul>
            </div>
          ))}
      </ErrorBoundary>
    </div>
  );
}
