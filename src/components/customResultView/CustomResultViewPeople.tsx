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
          <h3>
            <AuthorLink
              key={result.id.raw}
              id={result.id.raw}
              name={result.name?.raw}
              idLattes={result.lattesId?.raw!}
            />
          </h3>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
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
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPeople;
