/* eslint-disable  @typescript-eslint/no-non-null-asserted-optional-chain */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import AuthorLink from '../externalLinks/AuthorLink';
import ShowItem from './ShowItem';

const CustomResultViewPeople = ({ result }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <AuthorLink
              key={result.id.raw}
              id={result.id.raw}
              name={result.name?.raw}
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
                  <a key={orgunit.id} href={`/organizations/${orgunit.id}`}>
                    {orgunit.name!}
                  </a>
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
                {result.community?.raw.map((community: any, index: any) => <span key={index}>{community.name}</span>)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPeople;
