import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Search from '../../components/Search';
import Patents from '../../configs/Patents';
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
  const { t } = useTranslation('common');
  return (
    <div>
      <Head>
        <title>{`${t('Organizations')} | BrCris`}</title>
      </Head>
      <div className="page-search">
        <CustomProvider>
          <SearchProvider config={Patents.config}>
            <Search index={Patents} />
          </SearchProvider>
        </CustomProvider>
      </div>
    </div>
  );
}
