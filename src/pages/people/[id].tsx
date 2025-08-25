/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRouter } from 'next/router';
import { CustomProvider } from '../../components/context/CustomContext';
import { SearchProvider } from '@elastic/react-search-ui';
import APIConnector from '../../services/APIConnector';
import { RequestState, SearchDriverOptions } from '@elastic/search-ui';
import Loader from '../../components/Loader';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PeopleDetails from '../../components/details/PeopleDetails';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'advanced', 'facets'])),
  },
});

const indexName = process.env.INDEX_PERSON || '';

console.log('indexName', indexName);

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
      searchTerm: id as string,
    },
    searchQuery: {
      // @ts-ignore
      index: indexName,
      search_fields: {
        _id: {},
      },
      result_fields: {
        id: {
          raw: {},
        },
        name: {
          raw: {},
        },
        lattesId: {
          raw: {},
        },
        nationality: {
          raw: {},
        },
        orcid: {
          raw: {},
        },
        researchArea: {
          raw: {},
        },
        orgunit: {
          raw: {},
        },
        community: {
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
          <PeopleDetails />
        </SearchProvider>
      </CustomProvider>
    </div>
  );
}
