/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const VIVO_URL_BASE = process.env.VIVO_URL_BASE

const CustomResultViewPeople = ({ result, onClickLink }: ResultViewProps) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <a
              onClick={onClickLink}
              target="_blank"
              href={`${VIVO_URL_BASE}/journ_${result.id.raw}&lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.title?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">Id</span>
              <span className="sui-result__value">{result.id?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">Issn</span>
              {/* {result.issn ? (
                <span className="sui-result__key">Issn</span>
              ) : (
                ' '
              )} */}

              <span className="sui-result__value">{result.issn?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">Issnl</span>
              {/* {result.issnl ? (
                <span className="sui-result__key">Issnl</span>
              ) : (
                ' '
              )} */}

              <span className="sui-result__value">{result.issnl?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Title')}</span>
              {/* {result.title ? (
                <span className="sui-result__key">Title</span>
              ) : (
                ' '
              )} */}

              <span className="sui-result__value">{result.title?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Status')}</span>
              {/* {result.status ? (
                <span className="sui-result__key">Status</span>
              ) : (
                ''
              )} */}

              {result.status?.raw.map((status: any, index: any) => (
                <span key={index} className="sui-result__value">
                  {status + ', '}
                </span>
              ))}
            </li>

            <li>
              <span className="sui-result__key">{t('Publisher')}</span>
              {/* {result.publisher ? (
                <span className="sui-result__key">Publisher</span>
              ) : (
                ''
              )} */}

              {result.publisher?.raw.map((publisher: any, index: any) => (
                <span key={index} className="sui-result__value">
                  {publisher.name}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </li>
  )
}

export default CustomResultViewPeople
