import { useRouter } from 'next/router';
import { Author } from '../../types/Entities';
import LattesLink from './LattesLink';
const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

function AuthorLink({ id, name, idLattes }: Author) {
  const router = useRouter();
  return (
    <>
      <a key={id} target="_blank" href={`${VIVO_URL_ITEM_BASE}/pers_${id}?lang=${router.locale}`} rel="noreferrer">
        {name}
      </a>
      {idLattes ? <LattesLink lattesId={idLattes!} /> : ''}
    </>
  );
}

export default AuthorLink;
