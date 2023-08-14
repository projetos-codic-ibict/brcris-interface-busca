import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

type Props = {
  // Add custom props here
};
// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['about', 'navbar'])),
  },
});

export default function About() {
  const { t } = useTranslation('about');
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
              <h2 className="text-center">Termo de Uso</h2>
              <p>
                O presente instrumento apresenta o Termo de Uso do BrCris (Ecossistema de Informação da Pesquisa
                Científica Brasileira), hospedado no sítio eletrônico https://brcris.ibict.br, desenvolvido pelo
                Instituto Brasileiro de Informação em Ciência e Tecnologia (Ibict).
              </p>
              <p>
                O BrCris é uma plataforma computacional para integração, visualização e prospecção de dados científicos
                com a finalidade de estabelecer um modelo único de organização da informação científica de todo o
                ecossistema da pesquisa brasileira. Entre os agentes deste ecossistema estão os pesquisadores, os
                projetos, infraestruturas, laboratórios e instituições de pesquisa, os financiadores, além dos
                resultados da pesquisa expressos principalmente por publicações científicas, teses, dissertações,
                conjuntos de dados científicos e patentes.
              </p>
              <h3>DO OBJETO</h3>
              <p>
                A plataforma visa conceder ao USUÁRIO acessar e baixar dados sobre a pesquisa científica brasileira
                disponibilizados para acesso à terceiros, conforme as regras apresentadas abaixo, além das leis
                aplicáveis, cuja permissão de uso é concedida mediante o aceite expresso e inequívoco às condições deste
                documento.
              </p>
              <h3> DA ACEITAÇÃO</h3>
              <p>
                Ao utilizar a plataforma o USUÁRIO aceita integralmente as presentes normas e compromete-se a
                observá-las, sob risco de aplicação das penalidades cabíveis. Ao fazer uso dos dados disponibilizados
                pela plataforma o usuário aceita de forma automática os termos deste documento.
              </p>
              <h3>DO ACESSO DOS USUÁRIOS</h3>
              <p>
                Para o tratamento dos dados foi desenvolvida uma biblioteca computacional contendo uma estrutura de
                dados preparada para facilitar o processamento de dados originários de diversas fontes para o formato
                exigido pela plataforma. Nesse sentido, a biblioteca desenvolvida é responsável por toda a transformação
                e exportação dos dados, utilizando como base o “Modelo de Dados” estabelecido, validando as entidades,
                campos e relacionamentos aceitos pelo modelo.
              </p>
              <h3>Instituto Brasileiro de Informação em Ciência e Tecnologia (Ibict) </h3>
              <p>
                O BrCris reserva o direito de realizar aprimoramentos nas funcionalidades do Site, comprometendo-se a
                preservar ao máximo suas aplicações e não causar qualquer prejuízo ou danos aos Usuários. O BrCris
                emprega seus melhores esforços para a disponibilidade contínua de seu Site, podendo, eventualmente,
                ocorrer indisponibilidade temporária decorrente de manutenção. Em caso de ocorrência da
                indisponibilidade, o Ibict compromete-se a atuar em todas medidas que estejam ao seu alcance, visando
                restabelecer o acesso do Site pelos Usuários o mais breve possível. Eventuais procedimentos de
                manutenção do Site serão informados aos Usuários, por meio dos canais oficiais de comunicação do Ibict.
              </p>
            </div>
            <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
              <h2 className="text-center">Fontes de coleta</h2>
              <p>
                O BrCris desempenha um papel fundamental na agregação de um amplo conjunto de fontes de dados essenciais
                para compreender o Ecossistema de Informação da Pesquisa Científica Brasileira. Essas informações
                valiosas só são possíveis graças à integração de diversos conjuntos de dados relevantes. Entre as
                principais fontes de dados coletadas pelo BrCris, destacam-se:
              </p>
            </div>
            <div className="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">
              <h2 className="text-center">Publicações</h2>
              <h3>2023</h3>
              <p>.....</p>
              <p>.....</p>
              <h3>2022</h3>
              <p>.....</p>
              <p>.....</p>
            </div>
            <div className="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab">
              <h2 className="text-center">Arquitetura do sistema</h2>
              <p>
                A arquitetura do BrCris é baseada na descrição e mapeamento de conexões entre os diferentes agentes do
                ecossistema da pesquisa científica brasileira, entre os quais estão: pesquisadores, financiadores,
                projetos, organizações, infraestruturas de laboratórios e equipamentos e resultados da pesquisa
                (publicações científicas, patentes etc).
              </p>
            </div>
            <div className="tab-pane" id="history" role="tabpanel" aria-labelledby="history-tab">
              <h2 className="text-center">Histórico</h2>
              <p>
                Para conhecermos como a ciência evolui, quais são seus atores, o que foi investigado, como o
                conhecimento é difundido e comunicado, e quais as tendências futuras, é necessário contar com mecanismo
                de consulta de informações acadêmicas/técnicas/científicas. O real entendimento da ciência depende da
                abrangência, completude e organização de onde as informações são coletadas. É neste contexto que o
                BrCris está inserido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
