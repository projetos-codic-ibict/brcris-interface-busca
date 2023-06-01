/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'
import { useRouter } from 'next/router'
import { Author, OrgUnit, Service } from '../types/Entities'

const VIVO_URL_BASE = process.env.VIVO_URL_BASE

const CustomResultViewPublications = ({
  result,
  onClickLink,
}: ResultViewProps) => {
  const router = useRouter()
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <a
              onClick={onClickLink}
              target="_blank"
              href={`${VIVO_URL_BASE}/publ_${result.id.raw}&lang=${router.locale}`}
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
                    href={`${VIVO_URL_BASE}/pers_${author.id}&lang=${router.locale}`}
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
                  ? 'Institution(s)'
                  : result.type?.raw == 'conference proceedings'
                  ? 'Organization(s)'
                  : 'Journals(s)'}
                {''}
              </span>
              <span className="sui-result__value">
                {result.orgunit?.raw.map((org: OrgUnit) => (
                  <a
                    key={org.id}
                    target="_blank"
                    rel="noreferrer"
                    href={`${VIVO_URL_BASE}/org_${org.id}&lang=${router.locale}`}
                  >
                    {org.name}
                  </a>
                ))}

                {result.service?.raw.map((service: Service) =>
                  service.title?.map((title: string) => (
                    <a
                      key={title}
                      target="_blank"
                      rel="noreferrer"
                      href={`${VIVO_URL_BASE}/serv_${service.id}&lang=${router.locale}`}
                    >
                      {title}
                    </a>
                  ))
                )}

                {result.journal?.raw.map((journal: any, index: any) => (
                  <a
                    key={index}
                    target="_blank"
                    rel="noreferrer"
                    href={`${VIVO_URL_BASE}/journ_${journal.id}&lang=${router.locale}`}
                  >
                    {journal.title ? journal.title : journal}
                  </a>
                ))}
              </span>
            </li>

            <li>
              <span className="sui-result__key">Language(s)</span>
              {/* {result.language ? (
                <span className="sui-result__key">Language(s)</span>
              ) : (
                ' '
              )} */}

              {result.language?.raw.map((language: string, index: any) => (
                <span key={index} className="sui-result__value">
                  {language + ', '}
                </span>
              ))}
            </li>

            <li>
              <span className="sui-result__key">Cnpq Research Area(s)</span>
              {/* {result.cnpqResearchArea ? (
                <span className="sui-result__key">Cnpq Research Area(s)</span>
              ) : (
                ' '
              )} */}

              {result.cnpqResearchArea?.raw.map(
                (cnpqResearchArea: string, index: any) => (
                  <span key={index} className="sui-result__value">
                    {cnpqResearchArea + ', '}
                  </span>
                )
              )}
            </li>

            <li>
              <span className="sui-result__key">Keyword</span>
              {/* {result.keyword ? (
                <span className="sui-result__key">Keyword</span>
              ) : (
                ' '
              )} */}

              {result.keyword?.raw.map((keyword: string, index: any) => (
                <span key={index} className="sui-result__value">
                  {keyword + ', '}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </li>
  )
}

export default CustomResultViewPublications
