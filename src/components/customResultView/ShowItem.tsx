import ExternalLink from '../externalLinks';

type ShowItemProps = {
  label: string;
  value: string | string[];
  urlLink?: string;
};

const ShowItem = ({ label, value, urlLink }: ShowItemProps) => {
  return (
    <li>
      <span className="sui-result__key">{label}</span>
      <span className="sui-result__value">
        {typeof value === 'string' ? (
          urlLink ? (
            <ExternalLink content={value} url={urlLink} />
          ) : (
            value
          )
        ) : (
          value?.map((v: string, index: number) => (
            <span key={index}>{urlLink ? <ExternalLink content={v} url={urlLink} /> : v}</span>
          ))
        )}
      </span>
    </li>
  );
};

export default ShowItem;
