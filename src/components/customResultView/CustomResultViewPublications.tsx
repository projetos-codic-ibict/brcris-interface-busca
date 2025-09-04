import { ResultViewProps } from '@elastic/react-search-ui-views';
import { useTranslation } from 'next-i18next';
import ShowAuthorItem from './ShowAuthorItem';
import ShowItem from './ShowItem';
import { Link } from 'lucide-react';

const CustomResultViewPublications = ({ result, onClickLink }: ResultViewProps) => {
  const { t } = useTranslation('common');
  return (
    <li className="sui-result">
      <div>
        <div className="sui-result__header">
          <h3>
            <a onClick={onClickLink} href={`/publications/${result.id.raw}`}>
              {result.title?.raw} <Link />
            </a>
          </h3>
        </div>

        <div className="sui-result__body">
          <ul className="sui-result__details">
            <ShowAuthorItem label={t('Author')} authors={result.author?.raw} />
            <ShowItem label={t('Year')} value={result.publicationDate?.raw} />
            <ShowItem label={t('Type')} value={result.type?.raw} />
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CustomResultViewPublications;
