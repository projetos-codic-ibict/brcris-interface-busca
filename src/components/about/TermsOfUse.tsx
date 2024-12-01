/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
//@ts-ignore
type Props = {
  // Add custom props here
};
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'pt-BR', ['about', 'navbar', 'common'])),
  },
});

const TermsOfUse = () => {
  const { t } = useTranslation(['about', 'common']);
  const [isMounted, setIsMounted] = useState(false); // Need this for the dangerouslySetInnerHTML
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return <>{isMounted && <div dangerouslySetInnerHTML={{ __html: t('html:terms of use') || '' }} />}</>;
};

export default TermsOfUse;
