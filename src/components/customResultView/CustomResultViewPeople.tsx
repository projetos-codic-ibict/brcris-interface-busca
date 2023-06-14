/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'
import { useTranslation } from 'next-i18next'
import AuthorLink from '../externalLinks/AuthorLink'

const CustomResultViewPeople = ({ result }: ResultViewProps) => {
  const { t } = useTranslation('common')
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <AuthorLink
              key={result.id.raw}
              id={result.id.raw}
              name={result.name?.raw}
              idLattes={result.lattesId.raw!}
            />
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Nationality')}</span>

              <span className="sui-result__value">
                {result.nationality?.raw}
              </span>
            </li>

            <li>
              <span className="sui-result__key">{t('Orcid')}</span>
              <span className="sui-result__value">
                {result.orcid ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://orcid.org/${result.orcid?.raw}`}
                  >
                    https://orcid.org/{result.orcid?.raw}
                  </a>
                ) : (
                  ''
                )}
              </span>
            </li>

            <li>
              <span className="sui-result__key">{t('Research area(s)')}</span>

              <span className="sui-result__value">
                {result.researchArea?.raw.map((area: string) => (
                  <span key={area}>{area}</span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  )
}

export default CustomResultViewPeople
