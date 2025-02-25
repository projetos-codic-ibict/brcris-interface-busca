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
              value={result.orcid ? `https://orcid.org/${result.orcid?.raw}` : ''}
              urlLink={result.orcid ? `https://orcid.org/${result.orcid?.raw}` : ''}
            />
            <ShowItem label={t('Research area(s)')} value={result.researchArea?.name_keyword?.raw} />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPeople;
