/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { OrgUnit } from '../../types/Entities';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

const CustomResultViewPeople = ({ result, onClickLink }: ResultViewProps) => {
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
              href={`${VIVO_URL_ITEM_BASE}/prog_${result.id.raw}&lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.name?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Institution')}</span>
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
              </span>
            </li>
            <li>
              <span className="sui-result__key">{t('Capes research area')}</span>
              <span className="sui-result__value">{result.capesResearchArea?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">{t('CNPq research area')}</span>
              <span className="sui-result__value">{result.cnpqResearchArea?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">{t('Evaluation area')}</span>
              <span className="sui-result__value">{result.evaluationArea?.raw}</span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPeople;
