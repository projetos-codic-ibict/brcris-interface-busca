import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Architecture from '../components/about/Architecture';
import DataSources from '../components/about/DataSources';
import History from '../components/about/History';
import Publications from '../components/about/Publications';
import TermsOfUse from '../components/about/TermsOfUse';

type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['about', 'navbar', 'common'])),
  },
});

export default function About() {
  const { t } = useTranslation(['about', 'common']);
  return (
    <>
      <Head>
        <title>{`BrCris - ${t('About')}`}</title>
      </Head>
      <div className="App">
        <div className="container page about d-flex align-content-center flex-column">
          <div className="page-title">
            <h1>{t('About')}</h1>
          </div>
          <ul className="nav nav-tabs d-flex justify-content-center" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                {t('Terms of use')}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                {t('Data sources')}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="messages-tab"
                data-bs-toggle="tab"
                data-bs-target="#messages"
                type="button"
                role="tab"
                aria-controls="messages"
                aria-selected="false"
              >
                {t('Publications')}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="settings-tab"
                data-bs-toggle="tab"
                data-bs-target="#settings"
                type="button"
                role="tab"
                aria-controls="settings"
                aria-selected="false"
              >
                {t('System architecture')}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="history-tab"
                data-bs-toggle="tab"
                data-bs-target="#history"
                type="button"
                role="tab"
                aria-controls="history"
                aria-selected="false"
              >
                {t('History')}
              </button>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <h2 className="text-center">{t('Terms of Use')}</h2>
              <TermsOfUse />
            </div>
            <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
              <h2 className="text-center">{t('Data sources')}</h2>
              <DataSources />
            </div>
            <div className="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">
              <h2 className="text-center">{t('Publications')}</h2>
              <Publications />
            </div>
            <div className="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab">
              <h2 className="text-center">{t('System architecture')}</h2>
              <Architecture />
            </div>
            <div className="tab-pane" id="history" role="tabpanel" aria-labelledby="history-tab">
              <h2 className="text-center">{t('History')}</h2>
              <History />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
