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
            <ShowItem label={t('Type')} value={result.type?.raw} />
            <ShowItem label={t('ISSN')} value={result.issn?.raw} />
            <ShowAuthorItem label={t('Publisher')} authors={result.publisher?.raw} />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewJournals;
