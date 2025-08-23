/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRouter } from 'next/router';
import { CustomProvider } from '../../components/context/CustomContext';
import { SearchProvider } from '@elastic/react-search-ui';
import PublicationDetails from '../../components/customResultView/PublicationDetails';
import Connector from '../../services/APIConnector';
import { RequestState, SearchDriverOptions } from '@elastic/search-ui';
import Loader from '../../components/Loader';

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
    apiConnector: new Connector(),
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
    <div>
      <CustomProvider>
        <SearchProvider config={config}>
          <PublicationDetails />
        </SearchProvider>
      </CustomProvider>
    </div>
  );
}
