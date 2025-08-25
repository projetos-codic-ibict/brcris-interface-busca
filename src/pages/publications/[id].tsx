/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRouter } from 'next/router';
import { CustomProvider } from '../../components/context/CustomContext';
import { SearchProvider } from '@elastic/react-search-ui';
import PublicationDetails from '../../components/details/PublicationDetails';
import APIConnector from '../../services/APIConnector';
import { RequestState, SearchDriverOptions } from '@elastic/search-ui';
import Loader from '../../components/Loader';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'advanced', 'facets'])),
  },
});

const indexName = process.env.INDEX_PUBLICATION || '';

const routingOptions = {
  readUrl: () => '',
  writeUrl: () => {},
  urlToState: () => ({}) as RequestState,
  stateToUrl: () => '',
  routeChangeHandler: () => () => {},
};

export default function PublicationDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const config: SearchDriverOptions = {
    debug: true,
    alwaysSearchOnInitialLoad: true,
    routingOptions: routingOptions,
    apiConnector: new APIConnector(),
    initialState: {
      filters: [{ field: '_id', type: 'all', values: [id!] }],
      resultsPerPage: 1,
    },
    searchQuery: {
      // @ts-ignore
      index: indexName,
      result_fields: {
        advisor: {
          raw: {},
        },
        author: {
          raw: [],
        },
        coadvisor: {
          raw: {},
        },
        conference: {
          raw: {},
        },
        course: {
          raw: {},
        },
        doi: {
          raw: {},
        },
        journal: {
          raw: {},
        },
        keyword: {
          snippet: {},
        },
        language: {
          raw: [],
        },
        openalexId: {
          raw: [],
        },
        orgunit: {
          snippet: {},
        },
        program: {
          snippet: {},
        },
        publicationDate: {
          snippet: {},
        },
        researchArea: {
          raw: [],
        },
        service: {
          raw: {},
        },
        title: {
          snippet: {},
        },
        type: {
          raw: {},
        },
        year: {
          raw: {},
        },
      },
    },
  };

  if (!id) {
    return <Loader />;
  }
  return (
    <div className="container details-page">
      <CustomProvider>
        <SearchProvider config={config}>
          <PublicationDetails />
        </SearchProvider>
      </CustomProvider>
    </div>
  );
}
