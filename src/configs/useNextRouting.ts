import type { SearchDriverOptions } from '@elastic/search-ui';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useNextRouting = (config: SearchDriverOptions, basePathUrl: string) => {
  const router = useRouter();
  const { asPath } = router;

  const getSearchParamsFromUrl = (url: string) => {
    console.log('getSearchParamsFromUrl', url);
    return url.match(/\?(.+)/)?.[1] || '';
  };

  const routingOptions = {
    // read and write only the query string to search UI
    // as we are leveraging existing stateToUrl and urlToState functions
    // which are based on the query string
    readUrl: () => {
      console.log('readUrl');
      return getSearchParamsFromUrl(asPath);
    },
    writeUrl: (url: string, { replaceUrl }: { replaceUrl: boolean }) => {
      const method = router[replaceUrl ? 'replace' : 'push'];
      const params = Object.fromEntries(new URLSearchParams(url).entries());
      console.log('writeUrl', url, params);
      method({ query: { ...router.query, ...params } }, undefined, {
        shallow: true,
      });
    },
    routeChangeHandler: (callback: (url: string) => void) => {
      console.log('routeChangeHandler');
      const handler = (fullUrl: string) => {
        if (fullUrl.includes(basePathUrl)) {
          callback(getSearchParamsFromUrl(fullUrl));
        }
      };
      router.events.on('routeChangeComplete', handler);
      return () => {
        router.events.off('routeChangeComplete', handler);
      };
    },
  };

  return useMemo(() => {
    return {
      ...config,
      routingOptions,
    };
  }, [router]);
};
