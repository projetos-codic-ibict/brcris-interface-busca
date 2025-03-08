import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

const CustomResultViewJournals = ({ result, onClickLink }: ResultViewProps) => {
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
              href={`${VIVO_URL_ITEM_BASE}/journ_${result.id.raw}?lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.title_keyword?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowItem label={t('Qualis')} value={result.qualis?.raw} />
            <ShowItem label={t('H5index')} value={result.H5index?.raw} />
            <ShowItem label={t('Type')} value={result.type?.raw} />
            <ShowItem label={t('ISSN')} value={result.issn?.raw} />
            <ShowItem label={t('ISSN-L')} value={result.issnl?.raw} />
            <ShowItem label={t('Access type')} value={result.accessType?.raw} />
            <ShowItem label={t('Status')} value={result.status?.raw} />
            <ShowAuthorItem label={t('Publisher')} authors={result.publisher?.raw} />
            <ShowItem label={t('Keywords')} value={result.keywords?.raw} />
            <ShowItem
              label={t('Research field')}
              value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                <span key={index}>{researchArea.name_keyword}</span>
              ))}
            />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewJournals;
