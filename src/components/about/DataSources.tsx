/* eslint-disable react/no-unescaped-entities */
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  // Add custom props here
};
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['about', 'navbar', 'common'])),
  },
});

const DataSources = () => {
  const { t } = useTranslation(['about', 'common']);
  const [isMounted, setIsMounted] = useState(false); // Need this for the dangerouslySetInnerHTML
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return <>{isMounted && <div dangerouslySetInnerHTML={{ __html: t('html:data sources') || '' }} />}</>;
};

export default DataSources;
