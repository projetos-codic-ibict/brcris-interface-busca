import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
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
              href={`${VIVO_URL_ITEM_BASE}/org_${result.id.raw}?lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.name_keyword?.raw}
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

export default CustomResultViewPeople;
