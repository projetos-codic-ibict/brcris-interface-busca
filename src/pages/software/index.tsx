import { useTranslation } from 'next-i18next';
import Search from '../../components/Search';
import Software from '../../configs/Software';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
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
        <title>{`${t('Software')} | BrCris`}</title>
      </Head>
      <div className="page-search">
        <CustomProvider>
          <SearchProvider config={Software.config}>
            <Search index={Software} />
          </SearchProvider>
        </CustomProvider>
      </div>
    </div>
  );
}
