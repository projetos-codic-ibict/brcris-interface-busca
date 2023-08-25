import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import membersData from '../../team/members.json';
import Member from '../components/team/Member';
import { MemberType } from '../types/Entities';

type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'common'])),
  },
});

const getMembersData = (): MemberType[] => {
  const result = JSON.stringify(membersData);
  const members = JSON.parse(result);
  return members;
};

export default function Team() {
  const { t } = useTranslation(['navbar', 'common']);

  return (
    <>
      <Head>
        <title>{`BrCris - ${t('Team')}`}</title>
      </Head>
      <div className="App">
        <div className="container page d-flex align-content-center flex-column">
          <div className="page-title">
            <h1>{t('Team')}</h1>
          </div>
          <div className="team">
            {getMembersData().map((member: MemberType, index: number) => (
              <Member key={index} image={member.image} name={member.name} lattes={member.lattes} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
