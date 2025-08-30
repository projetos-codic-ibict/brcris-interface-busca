import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import ShowItem from './ShowItem';

const CustomResultViewOrganizations = ({ result, onClickLink }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <a onClick={onClickLink} href={`/organizations/${result.id.raw}`}>
              {result.name?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowItem value={result.acronym?.raw} label={t('Acronym')} />
            <ShowItem value={result.country?.raw} label={t('Country')} />
            <ShowItem value={result.state?.raw} label={t('State')} />
            <ShowItem value={result.city?.raw} label={t('City')} />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewOrganizations;
