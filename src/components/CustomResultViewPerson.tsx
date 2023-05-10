/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'

// type Author = {
//   id: string
//   name: string
// }
// type OrgUnit = {
//   id: string
//   name: string
// }

// type Service = {
//   id: string
//   title: string[]
// }
const VIVO_URL_BASE = process.env.VIVO_URL_BASE

const CustomResultViewPerson = ({ result, onClickLink }: ResultViewProps) => (
  <li className="sui-result">
    <div>
      <div className="sui-result__header">
        <h6>
          <a
            onClick={onClickLink}
            target="_blank"
            href={`${VIVO_URL_BASE}/pers_${result.id.raw}`}
            rel="noreferrer"
          >
            {result.name.raw}
          </a>
        </h6>
      </div>

      <div className="sui-result__body">
        <ul className="sui-result__details">
          <li>
            <span className="sui-result__key">Lattes</span>
            <span className="sui-result__value">
              {result.lattesId ? (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`http://lattes.cnpq.br/${result.lattesId.raw}`}
                >
                  http://lattes.cnpq.br/{result.lattesId.raw}
                </a>
              ) : (
                ''
              )}
            </span>
          </li>

          <li>
            <span className="sui-result__key">Nationality</span>
            <span className="sui-result__value">{result.nationality?.raw}</span>
          </li>

          <li>
            <span className="sui-result__key">Orcid</span>
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
            <span className="sui-result__key">Research Area</span>
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

export default CustomResultViewPerson
