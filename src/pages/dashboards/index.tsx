import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'common'])),
  },
});

export default function Dashboards() {
  const { t } = useTranslation(['common']);
  return (
    <>
      <Head>
        <title>{`BrCris - ${t('Dashboards')}`}</title>
      </Head>
      <div className="App">
        <div className="container page d-flex align-content-center flex-column">
          <div className="page-title">
            <h1>{t('Dashboards')}</h1>
          </div>
          <div className="dashboards">
            <div className="card text-center p-2">
              <Link href="/dashboards/publications">
                <a>
                  <h2>{t('Publications')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img className="img-fluid" src="/images/dashboards/publications.png" alt="ícone de publications" />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">
                      {t('Articles or documents published in scientific vehicles (Journals or Events)')}
                    </p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="card text-center p-2">
              <Link href="/dashboards/theses">
                <a>
                  <h2>{t('Theses and Dissertations')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img className="img-fluid" src="/images/dashboards/tese.png" alt="ícone de teses" />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">
                      {t("Academic monographs defended in Brazil at the master's or doctoral levels")}
                    </p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="card text-center p-2">
              <Link href="/dashboards/people">
                <a>
                  <h2>{t('People')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img className="img-fluid" src="/images/dashboards/people.png" alt="ícone de pessoas" />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">
                      {t(
                        'People dedicated to the scientific research activity and who participated in at least one scientific production'
                      )}
                    </p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="card text-center p-2">
              <Link href="/dashboards/journals">
                <a>
                  <h2>{t('Journals')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img className="img-fluid" src="/images/dashboards/journals.png" alt="ícone de revistas" />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">{t('Scientific journals used for the publication of articles')}</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="card text-center p-2">
              <Link href="/dashboards/patents">
                <a>
                  <h2>{t('Patents')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img className="img-fluid" src="/images/dashboards/patents.png" alt="ícone de patentes" />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">{t('Legal rights granted to people who own intellectual properties')}</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="card text-center p-2">
              <Link href="/dashboards/groups">
                <a>
                  <h2>{t('Research Groups')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img className="img-fluid" src="/images/dashboards/groups.png" alt="ícone de grupos de pesquisa" />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">{t('Teams made up of researchers and students')}</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="card text-center p-2">
              <Link href="/dashboards/softwares">
                <a>
                  <h2>{t('Softwares')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img className="img-fluid" src="/images/dashboards/softwares.png" alt="ícone de softwares" />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">{t('Set of computer programs registered by the researchers')}</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="card text-center p-2">
              <Link href="/dashboards/institutions">
                <a>
                  <h2>{t('Institutions')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img className="img-fluid" src="/images/dashboards/institutions.png" alt="ícone de instituições" />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">{t('Institutions')}</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="card text-center p-2">
              <Link href="/dashboards/programs">
                <a>
                  <h2>{t('Programs')}</h2>
                  <picture className="d-flex justify-content-center">
                    <img
                      className="img-fluid"
                      src="/images/dashboards/programs.png"
                      alt="ícone de programas de pós-graduação"
                    />
                  </picture>
                  <div className="card-body">
                    <p className="card-text">{t('Programs')}</p>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
