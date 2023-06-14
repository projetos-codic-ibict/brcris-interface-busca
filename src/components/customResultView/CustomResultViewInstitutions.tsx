/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

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
              href={`${VIVO_URL_BASE}/org_${result.id.raw}&lang=${router.locale}`}
              rel="noreferrer"
            >
              {result.name.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Address')}</span>
              <span className="sui-result__value">{result.address?.raw}</span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  )
}

export default CustomResultViewPeople
