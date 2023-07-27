/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import ReadMoreCollapse from '../ReadMoreCollapse';
import LattesLink from '../externalLinks/LattesLink';
import ShowItem from './ShowItem';

const CustomResultViewGroups = ({ result }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>{result.name.raw}</h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowItem label={t('Creation year')} value={result.creationYear?.raw} />

            <ShowItem label={t('Research line')} value={result.researchLine?.raw} />

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
                  {/* <ExternalLink
                    key={orgunit.id}
                    content={orgunit.name}
                    url={`${VIVO_URL_ITEM_BASE}/org_${orgunit.id}&lang=${router.locale}`}
                  /> */}
                </span>
              ))}
            </li>

            <ShowItem label={t('Status')} value={result.status?.raw} />

            <ReadMoreCollapse id={result.id?.raw}>
              <ShowItem label={t('Description')} value={result.description?.raw} />

              <ShowItem label={t('Knowledge area')} value={result.knowledgeArea?.raw} />

              <ShowItem label={t('Application sector')} value={result.applicationSector?.raw} />

              <ShowItem label={t('Keywords')} value={result.keyword?.raw} />

              <ShowItem label={t('URL')} value={result.URL?.raw} />

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

              <ShowItem label={t('Software')} value={result.software?.raw} />

              <ShowItem label={t('Equipment')} value={result.equipment?.raw} />
            </ReadMoreCollapse>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewGroups;
