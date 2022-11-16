import { ResultViewProps } from '@elastic/react-search-ui-views'

type Author = {
  id: string
  name: string
}
type OrgUnit = {
  id: string
  name: string
}
type Journal = {
  id: string
  title: string
}

const CustomResultView = ({ result, onClickLink }: ResultViewProps) => (
  <li className="sui-result">
    <div className="sui-result__header">
      <h6>
        <a
          onClick={onClickLink}
          target="_blank"
          href={result.vivo_link.raw}
          rel="noreferrer"
        >
          {result.title.raw}
        </a>
      </h6>
    </div>
    <div className="sui-result__body">
      <ul className="sui-result__details">
        <li>
          <span className="sui-result__key">Ano:</span>
          <span className="sui-result__value">
            {result.publicationDate?.raw}
          </span>
          <br />

          <span className="sui-result__key">Autor(es): </span>
          <span className="sui-result__value">
            {result.author?.raw.map((author: Author) => (
              <>
                <a
                  key={author.id}
                  target="_blank"
                  href={`https://brcris.ibict.br/vivo/display/pers_${author.id}`}
                  rel="noreferrer"
                >
                  {author.name}
                </a>
                <br />
              </>
            ))}
          </span>

          <span className="sui-result__key">OrgUnit:</span>
          <span className="sui-result__value">
            {result.orgunit?.raw.map((org: OrgUnit) => (
              <>{org.name}</>
            ))}
          </span>
          <br />

          <span className="sui-result__key">Tipo:</span>
          <span className="sui-result__value">{result.type.raw}</span>
          <br />

          <span className="sui-result__key">Revista: </span>
          <span className="sui-result__value">
            {result.journal?.raw.map((journal: Journal) => (
              <>{journal.title ? journal.title : journal}</>
            ))}
          </span>
        </li>
      </ul>
    </div>
  </li>
)

export default CustomResultView
