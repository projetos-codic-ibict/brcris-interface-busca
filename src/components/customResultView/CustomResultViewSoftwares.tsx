/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ReadMoreCollapse from '../ReadMoreCollapse';
import AuthorLink from '../externalLinks/AuthorLink';

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
              href={`${VIVO_URL_ITEM_BASE}/softw_${result.id.raw}&lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.name.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Description')}</span>
              <span className="sui-result__value">{result.description?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Creator(s)')}</span>
              <span className="sui-result__value">
                {result.creator?.raw.map((creator: any) => (
                  <AuthorLink key={creator.id} id={creator.id} name={creator.name} idLattes={creator.idLattes} />
                ))}
              </span>
            </li>
            <li>
              <span className="sui-result__key">{t('Release year')}</span>
              <span className="sui-result__value">{result.releaseYear?.raw}</span>
            </li>
            <li>
              <span className="sui-result__key">{t('Platform')}</span>
              {result.platform?.raw.map((platform: any, index: number) => (
                <span key={index} className="sui-result__value">
                  {platform}
                </span>
              ))}
            </li>

            <ReadMoreCollapse id={result.id?.raw}>
              <li>
                <span className="sui-result__key">{t('Deposit date')}</span>
                <span className="sui-result__value">{result.depositDate?.raw}</span>
              </li>
              <li>
                <span className="sui-result__key">{t('Registration country')}</span>
                <span className="sui-result__value">{result.registrationCountry?.raw}</span>
              </li>
              <li>
                <span className="sui-result__key">{t('Activity sector')}</span>
                <span className="sui-result__value">{result.activitySector?.raw}</span>
              </li>
              <li>
                <span className="sui-result__key">{t('Knowledge areas')}</span>
                {result.knowledgeAreas?.raw.map((area: any, index: number) => (
                  <span key={index} className="sui-result__value">
                    {area}
                  </span>
                ))}
              </li>
              <li>
                <span className="sui-result__key">{t('Keyword')}</span>
                <span className="sui-result__value">{result.keyword?.raw}</span>
              </li>
              <li>
                <span className="sui-result__key">{t('Language')}</span>
                <span className="sui-result__value">{result.language?.raw}</span>
              </li>
            </ReadMoreCollapse>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewSoftwares;
