import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { OrgUnit } from '../../types/Entities';
import ShowItem from './ShowItem';

const CustomResultViewPeople = ({ result, onClickLink }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h3>
            <a onClick={onClickLink} href={`/programs/${result.id.raw}`}>
              {result.name?.raw}
            </a>
          </h3>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Organization')}</span>
              <span className="sui-result__value">
                {result.orgunit?.raw.map((org: OrgUnit) => (
                  <a key={org.id} href={`/organizations/${org.id}`}>
                    {org.name!}
                  </a>
                ))}
              </span>
            </li>
            <ShowItem
              label={t('Research field')}
              value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                <span key={index}>{researchArea.name}</span>
              ))}
            />
            <ShowItem label={t('Evaluation area')} value={result.evaluationArea?.raw} />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPeople;
