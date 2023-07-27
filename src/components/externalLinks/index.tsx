type ExternalLinkProps = {
  content: string;
  url: string;
};

const ExternalLink = ({ content, url }: ExternalLinkProps) => {
  return (
    <a target="_blank" rel="noreferrer" href={url}>
      {content}
    </a>
  );
};

export default ExternalLink;
