/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
/* import { useRouter } from 'next/router'; */
/* import { Author, OrgUnit, Service } from '../../types/Entities'; */
import ReadMoreCollapse from '../ReadMoreCollapse';
import LattesLink from '../externalLinks/LattesLink';

const CustomResultViewGroups = ({ result }: ResultViewProps) => {
  // const [buttonReadText, setButtonReadText] = useState('Read more...');

  // function handleClick() {
  //   setButtonReadText(buttonReadText == 'Read more...' ? 'Read less' : 'Read more...');
  // }

  /* const router = useRouter(); */
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>{result.name.raw}</h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">{t('Creation year')}</span>
              <span className="sui-result__value">{result.creationYear?.raw}</span>
            </li>

            <li>
              <span className="sui-result__key">{t('Research line')}</span>
              {result.researchLine?.raw.map((line: string, index: any) => (
                <span key={index} className="sui-result__value">
                  {line + ', '}
                </span>
              ))}
            </li>

            <li>
              <span className="sui-result__key">{t('Leader')}</span>
              {result.leader?.raw.map((leader: any, index: any) => (
                <span key={index} className="sui-result__value">
                  <a target="_blank" href={`http://lattes.cnpq.br/${leader.idLattes}`} rel="noreferrer">
                    {leader.name}
                  </a>
                  {leader.idLattes ? <LattesLink lattesId={leader.idLattes!} /> : ''}
                </span>
              ))}
            </li>

            <li>
              <span className="sui-result__key">{t('Organization')}</span>
              {result.orgunit?.raw.map((orgunit: any, index: any) => (
                <span key={index} className="sui-result__value">
                  {orgunit.name}
                </span>
              ))}
            </li>

            <li>
              <span className="sui-result__key">{t('Status')}</span>
              <span className="sui-result__value">{result.status?.raw}</span>
            </li>
            <ReadMoreCollapse id={result.id?.raw}>
              <li>
                <span className="sui-result__key">{t('Description')}</span>
                <span className="sui-result__value">{result.description?.raw}</span>
              </li>

              <li>
                <span className="sui-result__key">{t('Knowledge area')}(s)</span>
                {result.knowledgeArea?.raw.map((area: string, index: any) => (
                  <span key={index} className="sui-result__value">
                    {area + ', '}
                  </span>
                ))}
              </li>

              <li>
                <span className="sui-result__key">{t('Application sector')}</span>
                {result.applicationSector?.raw.map((sector: string, index: any) => (
                  <span key={index} className="sui-result__value">
                    {sector + ', '}
                  </span>
                ))}
              </li>

              <li>
                <span className="sui-result__key">{t('Keyword')}</span>
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

              <li>
                <span className="sui-result__key">{t('URL')}</span>
                <span className="sui-result__value">
                  <a href="result.URL?.raw" target="_blank" no-referer>
                    {result.URL?.raw}
                  </a>
                </span>
              </li>

              <li>
                <span className="sui-result__key">{t('Partner')}</span>
                {result.partner?.raw.map((partner: any, index: any) => (
                  <span key={index} className="sui-result__value">
                    {partner.name}
                  </span>
                ))}
              </li>

              <li>
                <span className="sui-result__key">{t('Member')}(s)</span>
                {result.member?.raw.map((member: any, index: any) => (
                  <span key={index} className="sui-result__value">
                    <a target="_blank" href={`http://lattes.cnpq.br/${member.idLattes}`} rel="noreferrer">
                      {member.name}
                    </a>
                    {member.idLattes ? <LattesLink lattesId={member.idLattes!} /> : ''}
                  </span>
                ))}
              </li>

              <li>
                <span className="sui-result__key">{t('Software')}</span>
                {result.software?.raw.map((software: any, index: any) => (
                  <span key={index} className="sui-result__value">
                    {software.name}
                  </span>
                ))}
              </li>

              <li>
                <span className="sui-result__key">{t('Equipment')}</span>
                <span className="sui-result__value">{result.equipment?.raw}</span>
              </li>
            </ReadMoreCollapse>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewGroups;
