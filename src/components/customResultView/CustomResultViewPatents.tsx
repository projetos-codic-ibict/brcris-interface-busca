/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import AuthorLink from '../externalLinks/AuthorLink';

const CustomResultViewPatents = ({ result }: ResultViewProps) => {
  /* const router = useRouter() */
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>{result.espacenetTitle?.raw}</h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Inventor')}</span>
              <span className="sui-result__value">
                {result.inventor?.raw.map((inventor: any) => (
                  <AuthorLink
                    key={inventor.id}
                    id={inventor.id}
                    nationality={inventor.nationality}
                    name={inventor.name}
                    idLattes={inventor.idLattes}
                  />
                ))}
              </span>
            </li>
            <li>
              <span className="sui-result__key">{t('Applicant')}</span>
              {result.applicant?.raw.map((applicant: any, index: number) => (
                <span key={index} className="sui-result__value">
                  {applicant.name}
                </span>
              ))}
            </li>

            <li>
              <span className="sui-result__key">{t('Deposit date')}</span>
              <span className="sui-result__value">{result.depositDate?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Kind Code')}</span>
              <span className="sui-result__value">{result.kindCode?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Country Code')}</span>
              <span className="sui-result__value">{result.countryCode?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Lattes Title')}</span>
              <span className="sui-result__value">{result.lattesTitle?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Publication date')}</span>
              <span className="sui-result__value">{result.publicationDate?.raw}</span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPatents;
