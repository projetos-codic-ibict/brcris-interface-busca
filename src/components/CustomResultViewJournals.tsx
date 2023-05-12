/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'

const VIVO_URL_BASE = process.env.VIVO_URL_BASE

const CustomResultViewPeople = ({ result, onClickLink }: ResultViewProps) => (
  <li className="sui-result">
    <div>
      <div className="sui-result__header">
        <h6>
          <a
            onClick={onClickLink}
            target="_blank"
            href={`${VIVO_URL_BASE}/journ_${result.id.raw}`}
            rel="noreferrer"
          >
            {result.title.raw}
          </a>
        </h6>
      </div>

      <div className="sui-result__body">
        <ul className="sui-result__details">
          <li>
            <span className="sui-result__key">id</span>
            <span className="sui-result__value">{result.id.raw}</span>
          </li>

          <li>
            <span className="sui-result__key">issn</span>
            <span className="sui-result__value">{result.issn.raw}</span>
          </li>

          <li>
            <span className="sui-result__key">title</span>
            <span className="sui-result__value">{result.title.raw}</span>
          </li>
        </ul>
      </div>
    </div>
  </li>
)

export default CustomResultViewPeople
