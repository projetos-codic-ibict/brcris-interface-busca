import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import ReadMoreCollapse from '../ReadMoreCollapse';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

const CustomResultViewGroups = ({ result, onClickLink }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <a onClick={onClickLink} href={`/research-groups/${result.id.raw}`}>
              {result.name?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowItem label={t('Creation year')} value={result.creationYear?.raw} />
            <ShowItem label={t('Research line')} value={result.researchLine?.raw} />
            <ShowAuthorItem label={t('Leader')} authors={result.leader?.raw} />
            {result.orgunit && (
              <li>
                <span className="sui-result__key">{t('Organization')}</span>
                {result.orgunit?.raw.map((orgunit: any, index: any) => (
                  <span key={index} className="sui-result__value">
                    <a key={orgunit.id} href={`/organizations/${orgunit.id}`}>
                      {orgunit.name!}
                    </a>
                  </span>
                ))}
              </li>
            )}
            {result.partner && (
              <li>
                <span className="sui-result__key">{t('Partner')}</span>
                {result.partner?.raw.map((partner: any, index: any) => (
                  <span key={index} className="sui-result__value">
                    <a key={partner.id} href={`/organizations/${partner.id}`}>
                      {partner.name!}
                    </a>
                  </span>
                ))}
              </li>
            )}
            <ShowItem label={t('URL')} value={result.URL?.raw} urlLink={result.URL?.raw} />
            <ShowItem label={t('Status')} value={result.status?.raw} />
            <ShowItem label={t('Application sector')} value={result.applicationSector?.raw} />

            <ReadMoreCollapse id={result.id?.raw}>
              <ShowAuthorItem label={t('Member')} authors={result.member?.raw} />
              <ShowItem label={t('Knowledge area')} value={result.knowledgeArea?.raw} />
              <ShowItem label={t('Keywords')} value={result.keyword?.raw} />
              <ShowItem label={t('Software')} value={result.software?.raw} />
              <ShowItem label={t('Equipment')} value={result.equipment?.raw} />
              <ShowItem label={t('Description')} value={result.description?.raw} />
            </ReadMoreCollapse>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewGroups;
