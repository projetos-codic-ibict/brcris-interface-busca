import { PagingInfoViewProps } from '@elastic/react-search-ui-views';
import Connector from '../services/APIConnector';

const DefaultQueryConfig = () => {
  return {
    debug: false,
    indicators: [],
    advanced: false,
    urlPushDebounceLength: 500,
    alwaysSearchOnInitialLoad: false,
    hasA11yNotifications: true,
    a11yNotificationMessages: {
      searchResults: ({ start, end, totalResults, searchTerm }: PagingInfoViewProps) =>
        `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`,
    },
    apiConnector: new Connector(),
    initialState: {
      resultsPerPage: 10,
    },
  };
};

export default DefaultQueryConfig;
