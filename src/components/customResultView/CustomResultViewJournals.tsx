import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

const CustomResultViewJournals = ({ result, onClickLink }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h6>
            <a onClick={onClickLink} href={`/journals/${result.id.raw}`}>
              {result.title?.raw}
            </a>
          </h6>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowItem label={t('Qualis')} value={result.qualis?.raw} />
            <ShowItem label={t('H5index')} value={result.H5index?.raw} />
            <ShowItem label={t('Type')} value={result.type?.raw} />
            <ShowItem label={t('ISSN')} value={result.issn?.raw} />
            <ShowItem label={t('ISSN-L')} value={result.issnl?.raw} />
            <ShowItem label={t('Access type')} value={result.accessType?.raw} />
            <ShowItem label={t('Status')} value={result.status?.raw} />
            <ShowAuthorItem label={t('Publisher')} authors={result.publisher?.raw} />
            <ShowItem label={t('Keywords')} value={result.keywords?.raw} />
            <ShowItem
              label={t('Research field')}
              value={result.researchArea?.raw.map((researchArea: any, index: any) => (
                <span key={index}>{researchArea.name}</span>
              ))}
            />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewJournals;
