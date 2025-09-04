import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { OrgUnit } from '../../types/Entities';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

const CustomResultViewPatents = ({ result, onClickLink }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h3>
            <a onClick={onClickLink} href={`/patents/${result.id.raw}`}>
              {result.espacenetTitle?.raw}
            </a>
          </h3>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowAuthorItem label={t('Inventor(s)')} authors={result.inventor?.raw} />
            {result.applicant === undefined ? null : (
              <li>
                <span className="sui-result__key">{t('Applicant')}</span>
                {result.applicant?.raw.map((applicant: OrgUnit, index: number) => (
                  <span key={index} className="sui-result__value">
                    <a key={applicant.id} href={`/organizations${applicant.id}`}>
                      {applicant.name!}
                    </a>
                  </span>
                ))}
              </li>
            )}
            <ShowItem label={t('Deposit date')} value={result.depositDate?.raw} />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPatents;
