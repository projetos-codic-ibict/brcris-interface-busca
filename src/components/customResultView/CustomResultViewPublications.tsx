/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Author, OrgUnit, Service } from '../../types/Entities';
import AuthorLink from '../externalLinks/AuthorLink';

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
              href={`${VIVO_URL_ITEM_BASE}/publ_${result.id.raw}&lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.title.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Year')}</span>
              <span className="sui-result__value">{result.publicationDate?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Author')}</span>
              <span className="sui-result__value">
                {result.author?.raw.map((author: Author) => (
                  <AuthorLink key={author.id} id={author.id} name={author.name} idLattes={author.idLattes} />
                ))}
              </span>
            </li>

            <li>
              <span className="sui-result__key">{t('Type')}</span>
              <span className="sui-result__value">{result.type?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">
                {' '}
                {result.type?.raw == 'doctoral thesis' || result.type?.raw == 'master thesis'
                  ? `${t('Institution')}(s)`
                  : result.type?.raw == 'conference proceedings'
                  ? `${t('Organization')}(s)`
                  : `${t('Journals')}`}
                {''}
              </span>
              <span className="sui-result__value">
                {result.orgunit?.raw.map((org: OrgUnit) => (
                  <a
                    key={org.id}
                    target="_blank"
                    rel="noreferrer"
                    href={`${VIVO_URL_ITEM_BASE}/org_${org.id}&lang=${router.locale}`}
                  >
                    {org.name}
                  </a>
                ))}

                {result.service?.raw.map((service: Service) =>
                  service.title?.map((title: string) => (
                    <a
                      key={title}
                      target="_blank"
                      rel="noreferrer"
                      href={`${VIVO_URL_ITEM_BASE}/serv_${service.id}&lang=${router.locale}`}
                    >
                      {title}
                    </a>
                  ))
                )}

                {result.journal?.raw.map((journal: any, index: any) => (
                  <a
                    key={index}
                    target="_blank"
                    rel="noreferrer"
                    href={`${VIVO_URL_ITEM_BASE}/journ_${journal.id}&lang=${router.locale}`}
                  >
                    {journal.title ? journal.title : journal}
                  </a>
                ))}
              </span>
            </li>

            <li>
              <span className="sui-result__key">{t('Language')}</span>
              {/* {result.language ? (
                <span className="sui-result__key">Language(s)</span>
              ) : (
                ' '
              )} */}

              {result.language?.raw.map((language: string, index: any) => (
                <span key={index} className="sui-result__value">
                  {language + ', '}
                </span>
              ))}
            </li>

            <li>
              <span className="sui-result__key">{t('Research area(s)')}</span>
              {result.cnpqResearchArea?.raw.map((cnpqResearchArea: string, index: any) => (
                <span key={index} className="sui-result__value">
                  {cnpqResearchArea + ', '}
                </span>
              ))}
            </li>

            <li>
              <span className="sui-result__key">{t('Keyword')}</span>
              {/* {result.keyword ? (
                <span className="sui-result__key">Keyword</span>
              ) : (
                ' '
              )} */}

              {result.keyword?.raw.map((keyword: string, index: any) => (
                <span key={index} className="sui-result__value">
                  {keyword + ', '}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPublications;
