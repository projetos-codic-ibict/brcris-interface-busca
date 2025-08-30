/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRouter } from 'next/router';
import { CustomProvider } from '../../components/context/CustomContext';
import { SearchProvider } from '@elastic/react-search-ui';
import SoftwareDetails from '../../components/details/SoftwareDetails';
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

const indexName = process.env.INDEX_SOFTWARE || '';

const routingOptions = {
  readUrl: () => '',
  writeUrl: () => {},
  urlToState: () => ({}) as RequestState,
  stateToUrl: () => '',
  routeChangeHandler: () => () => {},
};

export default function SoftawareDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const config: SearchDriverOptions = {
    debug: false,
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
      search_fields: {
        name_text: {
          weight: 3,
        },
      },
      result_fields: {
        id: {
          raw: {},
        },
        name: {
          raw: {},
        },
        description: {
          raw: {},
        },
        creator: {
          raw: {},
        },

        depositDate: {
          raw: {},
        },
        releaseYear: {
          raw: {},
        },
        kind: {
          raw: {},
        },
        platform: {
          raw: {},
        },
        registrationCountry: {
          raw: {},
        },
        activitySector: {
          raw: {},
        },
        knowledgeAreas: {
          raw: {},
        },
        keyword: {
          raw: {},
        },
        language: {
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
          <SoftwareDetails />
        </SearchProvider>
      </CustomProvider>
    </div>
  );
}
