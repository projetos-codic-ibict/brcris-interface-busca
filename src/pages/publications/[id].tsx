import { useRouter } from 'next/router';

export default function PublicationDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Publication Details</h1>
      <p>Publication ID: {id}</p>
    </div>
  );
}
