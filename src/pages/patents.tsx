import Search from '../components/Search';
import Patents from '../configs/Patents';

import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'advanced', 'facets'])),
  },
});

export default function App() {
  return <Search index={Patents} />;
}
