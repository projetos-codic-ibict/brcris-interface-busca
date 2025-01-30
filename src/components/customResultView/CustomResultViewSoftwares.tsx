import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ReadMoreCollapse from '../ReadMoreCollapse';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

const CustomResultViewSoftwares = ({ result, onClickLink }: ResultViewProps) => {
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
              href={`${VIVO_URL_ITEM_BASE}/softw_${result.id.raw}?lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.name?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowItem label={t('Description')} value={result.description?.raw} />
            <ShowAuthorItem label={t('Creator(s)')} authors={result.creator?.raw} />
            <ShowItem label={t('Release year')} value={result.releaseYear?.raw} />
            <ShowItem label={t('Platform')} value={result.platform?.raw} />

            <ReadMoreCollapse id={result.id?.raw}>
              <ShowItem label={t('Deposit date')} value={result.depositDate?.raw} />
              <ShowItem label={t('Registration country')} value={result.registrationCountry?.raw} />
              <ShowItem label={t('Activity sector')} value={result.activitySector?.raw} />
              <ShowItem label={t('Knowledge areas')} value={result.knowledgeAreas?.raw} />
              <ShowItem label={t('Keywords')} value={result.keyword?.raw} />
              <ShowItem label={t('Language')} value={result.language?.raw} />
            </ReadMoreCollapse>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewSoftwares;
