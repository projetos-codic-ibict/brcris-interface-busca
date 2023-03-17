/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'

type Author = {
  id: string
  name: string
}
type OrgUnit = {
  id: string
  name: string
}

type Service = {
  id: string
  title: string[]
}
const CustomResultView = ({ result, onClickLink }: ResultViewProps) => (
  <li className="sui-result">
    <div>
      <div className="sui-result__header">
        <h6>
          <a
            onClick={onClickLink}
            target="_blank"
            href={result.vivo_link?.raw}
            rel="noreferrer"
          >
            {result.title.raw}
          </a>
        </h6>
      </div>
      <div className="sui-result__body">
        <ul className="sui-result__details">
          <li>
            <span className="sui-result__key">Year</span>
            <span className="sui-result__value">
              {result.publicationDate?.raw}
            </span>
          </li>
          <li>
            <span className="sui-result__key">Author(s)</span>
            <span className="sui-result__value">
              {result.author?.raw.map((author: Author) => (
                <a
                  key={author.id}
                  target="_blank"
                  href={`https://brcris.ibict.br/vivo/display/pers_${author.id}`}
                  rel="noreferrer"
                >
                  {author.name}
                </a>
              ))}
            </span>
          </li>
          <li>
            <span className="sui-result__key">Type</span>
            <span className="sui-result__value">{result.type?.raw}</span>
          </li>
          <li>
            <span className="sui-result__key">
              {' '}
              {result.type?.raw == 'doctoral thesis' ||
              result.type?.raw == 'master thesis'
                ? 'Instituição'
                : result.type?.raw == 'conference proceedings'
                ? 'Organização'
                : 'Revista'}
              {''}
            </span>
            <span className="sui-result__value">
              {result.orgunit?.raw.map((org: OrgUnit) => (
                <span key={org.id}>{org.name}</span>
              ))}

              {result.service?.raw.map((service: Service) =>
                service.title.map((title: string) => (
                  <span key={title}>{title}</span>
                ))
              )}

              {result.journal?.raw.map((journal: any, index: any) => (
                <span key={index}>
                  {journal.title ? journal.title : journal}
                </span>
              ))}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </li>
)

export default CustomResultView
