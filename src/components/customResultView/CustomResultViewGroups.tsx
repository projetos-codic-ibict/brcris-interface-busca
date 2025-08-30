import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

const CustomResultViewGroups = ({ result, onClickLink }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <a onClick={onClickLink} href={`/research-groups/${result.id.raw}`}>
              {result.name?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowItem label={t('Research line')} value={result.researchLine?.raw} />
            <ShowAuthorItem label={t('Leader')} authors={result.leader?.raw} />
            {result.orgunit && (
              <li>
                <span className="sui-result__key">{t('Organization')}</span>
                {result.orgunit?.raw.map((orgunit: any, index: any) => (
                  <span key={index} className="sui-result__value">
                    <a key={orgunit.id} href={`/organizations/${orgunit.id}`}>
                      {orgunit.name!}
                    </a>
                  </span>
                ))}
              </li>
            )}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewGroups;
