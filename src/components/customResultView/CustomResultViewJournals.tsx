/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

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
              href={`${VIVO_URL_ITEM_BASE}/journ_${result.id.raw}&lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.title?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Qualis')} </span>
              <span className="sui-result__value">{result.qualis?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">{t('Type')} </span>
              <span className="sui-result__value">{result.type?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">Issn</span>
              <span className="sui-result__value">{result.issn?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">Issnl</span>
              <span className="sui-result__value">{result.issnl?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">{t('Access type')} </span>
              <span className="sui-result__value">{result.accessType?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">{t('Status')} </span>
              <span className="sui-result__value">{result.status?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">{t('Publisher')}</span>
              {result.publisher?.raw.map((publisher: any, index: any) => (
                <span key={index} className="sui-result__value">
                  {publisher.name}
                </span>
              ))}
            </li>
            <li>
              <span className="sui-result__key">{t('Keywords')} </span>
              <span className="sui-result__value">{result.keywords?.raw}</span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPeople;
