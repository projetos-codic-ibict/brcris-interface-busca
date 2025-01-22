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
            <ShowItem label={t('Year')} value={result.publicationDate?.raw} />

            <ShowAuthorItem label={t('Author')} authors={result.author?.raw} />

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
                      content={org.name}
                      url={`${VIVO_URL_ITEM_BASE}/org_${org.id}?lang=${router.locale}`}
                    />
                  ))}

                  {result.service?.raw.map((service: Service) =>
                    service.title?.map((title: string) => (
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
                      content={journal.title ? journal.title : journal}
                      url={`${VIVO_URL_ITEM_BASE}/journ_${journal.id}?lang=${router.locale}`}
                    />
                  ))}
                </span>
              </li>
            )}

            <ShowItem label={t('Language')} value={result.language?.raw} />

            <ShowItem label={t('Research area(s)')} value={result.cnpqResearchArea?.raw} />

            <ShowItem label={t('Keywords')} value={result.keyword?.raw} />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPublications;
