import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { OrgUnit, Service } from '../../types/Entities';
import ExternalLink from '../externalLinks';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

const CustomResultViewPublications = ({ result, onClickLink }: ResultViewProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <a
              onClick={onClickLink}
              target="_blank"
              href={`${VIVO_URL_ITEM_BASE}/publ_${result.id.raw}?lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.title?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowAuthorItem label={t('Author')} authors={result.author?.raw} />
            <ShowItem label={t('Year')} value={result.publicationDate?.raw} />
            <ShowItem label={t('Type')} value={result.type?.raw} />

            {result.orgunit === undefined && result.service === undefined && result.journal === undefined ? null : (
              <li>
                <span className="sui-result__key">
                  {result.type?.raw == 'doctoral thesis' || result.type?.raw == 'master thesis'
                    ? `${t('Institution')}`
                    : result.type?.raw == 'conference proceedings'
                      ? `${t('Organization')}`
                      : `${t('Journals')}`}
                </span>
                <span className="sui-result__value">
                  {result.orgunit?.raw.map((org: OrgUnit) => (
                    <ExternalLink
                      key={org.id}
                      content={org.name_keyword!}
                      url={`${VIVO_URL_ITEM_BASE}/org_${org.id}?lang=${router.locale}`}
                    />
                  ))}

                  {result.service?.raw.map((service: Service) =>
                    service.title_keyword?.map((title: string) => (
                      <ExternalLink
                        key={title}
                        content={title}
                        url={`${VIVO_URL_ITEM_BASE}/serv_${service.id}?lang=${router.locale}`}
                      />
                    ))
                  )}

                  {result.journal?.raw.map((journal: any, index: any) => (
                    <ExternalLink
                      key={index}
                      content={journal.title_keyword ? journal.title_keyword : journal}
                      url={`${VIVO_URL_ITEM_BASE}/journ_${journal.id}?lang=${router.locale}`}
                    />
                  ))}
                </span>
              </li>
            )}

            <ShowItem label={t('Language')} value={result.language?.raw} />

            <ShowItem label={t('Keywords')} value={result.keyword_keyword?.raw} />
            <ShowAuthorItem label={t('Advisor')} authors={result.advisor?.raw} />
            <ShowAuthorItem label={t('Coadvisor')} authors={result.coadvisor?.raw} />
            {/* <ShowItem label={t('Year 2')} value={result.year?.raw} /> */}
            <ShowItem label={t('DOI')} value={result.doi?.raw} />
            <ShowItem label={t('OpenalexId')} value={result.openalexId?.raw} />

            <ShowItem
              label={t('Research field')}
              value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                <span key={index}>{researchArea.name_keyword}</span>
              ))}
            />
            <ShowItem
              label={t('Conference')}
              value={result.conference?.raw.map((conference: any, index: any) => (
                <span key={index}>{conference.name_keyword}</span>
              ))}
            />

            <ShowItem
              label={t('Program')}
              value={result.program?.raw.map((program: any, index: any) => (
                <span key={index} className="sui-result__value">
                  <ExternalLink
                    key={program.id}
                    content={program.name_keyword!}
                    url={`${VIVO_URL_ITEM_BASE}/org_${program.id}?lang=${router.locale}`}
                  />
                </span>
              ))}
            />
            <ShowItem
              label={t('Course')}
              value={result.course?.raw.map((course: any, index: any) => (
                <span key={index} className="sui-result__value">
                  <ExternalLink
                    key={course.id}
                    content={course.name_keyword!}
                    url={`${VIVO_URL_ITEM_BASE}/org_${course.id}?lang=${router.locale}`}
                  />
                </span>
              ))}
            />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPublications;
