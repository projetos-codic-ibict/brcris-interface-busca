import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';

const CustomResultViewSoftwares = ({ result, onClickLink }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h3>
            <a onClick={onClickLink} href={`/software/${result.id.raw}`}>
              {result.name?.raw}
            </a>
          </h3>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowItem label={t('Description')} value={result.description?.raw} />
            <ShowAuthorItem label={t('Creator(s)')} authors={result.creator?.raw} />
            <ShowItem label={t('Release year')} value={result.releaseYear?.raw} />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewSoftwares;
