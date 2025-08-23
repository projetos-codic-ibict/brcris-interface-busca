import Head from 'next/head';
import Search from '../../components/Search';
import Publications from '../../configs/Publications';

import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CustomProvider } from '../../components/context/CustomContext';
import { SearchProvider } from '@elastic/react-search-ui';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'advanced', 'facets'])),
  },
});

export default function App() {
  return (
    <div>
      <Head>
        <title>{`BrCris - `}</title>
      </Head>
      <div className="page-search">
        <CustomProvider>
          <SearchProvider config={Publications.config}>
            <Search index={Publications} />
          </SearchProvider>
        </CustomProvider>
      </div>
    </div>
  );
}
