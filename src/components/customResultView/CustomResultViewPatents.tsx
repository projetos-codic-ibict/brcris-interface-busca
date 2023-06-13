/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'
import { useTranslation } from 'next-i18next'
import AuthorLink from '../externalLinks/AuthorLink'
/* import { useRouter } from 'next/router' */
/* import { OrgUnit } from '../types/Entities'

const VIVO_URL_BASE = process.env.VIVO_URL_BASE */

const CustomResultViewPatents = ({ result }: ResultViewProps) => {
  /* const router = useRouter() */
  const { t } = useTranslation('common')
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>{result.espacenetTitle?.raw}</h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">Id</span>
              <span className="sui-result__value">{result.id?.raw}</span>
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
              <span className="sui-result__key">{t('Deposit Date')}</span>
              <span className="sui-result__value">
                {result.depositDate?.raw}
              </span>
            </li>

            <li>
              <span className="sui-result__key">{t('Kind Code')}</span>
              <span className="sui-result__value">{result.kindCode?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Country Code')}</span>
              <span className="sui-result__value">
                {result.countryCode?.raw}
              </span>
            </li>

            <li>
              <span className="sui-result__key">{t('Lattes Title')}</span>
              <span className="sui-result__value">
                {result.lattesTitle?.raw}
              </span>
            </li>

            <li>
              <span className="sui-result__key">{t('Publication Date')}</span>
              <span className="sui-result__value">
                {result.publicationDate?.raw}
              </span>
            </li>

            <li>
              <span className="sui-result__key">{t('Inventor')}</span>
              {result.inventor?.raw.map((inventor: any, index: number) => (
                <span key={index} className="sui-result__value">
                  <AuthorLink
                    key={inventor.id}
                    id={inventor.id}
                    nationality={inventor.nationality}
                    name={inventor.name}
                    idLattes={inventor.idLattes}
                  />
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </li>
  )
}

export default CustomResultViewPatents
