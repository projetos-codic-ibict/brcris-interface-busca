import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { OrgUnit } from '../../types/Entities';
import ExternalLink from '../externalLinks';
import ShowItem from './ShowItem';

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
              href={`${VIVO_URL_ITEM_BASE}/gprog_${result.id.raw}?lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.name_keyword?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Organization')}</span>
              <span className="sui-result__value">
                {result.orgunit?.raw.map((org: OrgUnit) => (
                  <ExternalLink
                    key={org.id}
                    content={org.name_keyword!}
                    url={`${VIVO_URL_ITEM_BASE}/org_${org.id}?lang=${router.locale}`}
                  />
                ))}
              </span>
            </li>
            <ShowItem
              label={t('Research field')}
              value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                <span key={index}>{researchArea.name_keyword}</span>
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
