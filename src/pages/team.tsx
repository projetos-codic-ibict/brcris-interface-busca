import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useEffect, useState } from 'react';
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

const shuffle = (array: MemberType[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function Team() {
  const { t } = useTranslation(['navbar', 'common']);

  const [members, setMembers] = useState<MemberType[]>([]);

  useEffect(() => {
    const result = JSON.stringify(membersData);
    const members = JSON.parse(result);
    setMembers(members);
  }, []);

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
            {shuffle(members).map((member: MemberType, index: number) => (
              <Member key={index} image={member.image} name={member.name} lattes={member.lattes} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
