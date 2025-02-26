/* eslint-disable  @typescript-eslint/no-non-null-asserted-optional-chain */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ExternalLink from '../externalLinks';
import AuthorLink from '../externalLinks/AuthorLink';
import ShowItem from './ShowItem';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

const CustomResultViewPeople = ({ result }: ResultViewProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <AuthorLink
              key={result.id.raw}
              id={result.id.raw}
              name={result.name_keyword?.raw}
              idLattes={result.lattesId?.raw!}
            />
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
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
                  <ExternalLink
                    key={orgunit.id}
                    content={orgunit.name_keyword!}
                    url={`${VIVO_URL_ITEM_BASE}/org_${orgunit.id}?lang=${router.locale}`}
                  />
                </span>
              ))}
            />
            <ShowItem
              label={t('Research field')}
              value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                <span key={index}>{researchArea.name_keyword}</span>
              ))}
            />
            <li>
              <span className="sui-result__key">{t('Community')}</span>
              <span className="sui-result__value">
                {result.community?.raw.map((community: any, index: any) => (
                  <span key={index}>{community.name_keyword}</span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPeople;
