/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryDslOperator, QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Filter, FilterValue } from '@elastic/search-ui';
import { parseElasticsearchQuery } from '../../../services/QueryFormat';
type QueryProps = {
  size: number;
  indicadorName: string;
  searchTerm: string;
  fields: string[];
  operator: QueryDslOperator;
  filters: [];
  order?: { _count?: string; _key?: string };
};
export default function getFormatedQuery({
  size = 10,
  indicadorName,
  searchTerm,
  fields,
  operator,
  filters,
  order = { _count: 'desc' },
}: QueryProps) {
  let query: QueryDslQueryContainer = {};
  console.log('searchTerm', searchTerm);
  if (searchTerm.indexOf('=') > 0) {
    query = parseElasticsearchQuery(searchTerm);
    if (query.bool) {
      query.bool.filter = filters && filters.length > 0 ? getFormatedFilters(filters) : [];
      query.bool.minimum_should_match = 1;
    }
    console.log('query', query);
  } else {
    query = {
      bool: {
        must: {
          query_string: {
            query: searchTerm || '*',
            default_operator: operator,
            fields: searchTerm ? fields : [],
          },
        },
        filter: filters && filters.length > 0 ? getFormatedFilters(filters) : [],
        // minimum_should_match: 1,
      },
    };
  }
  return {
    // track_total_hits: true,
    _source: [indicadorName],
    size: 0,
    aggs: {
      aggregate: {
        terms: {
          field: indicadorName,
          size: size,
          order: order,
        },
      },
    },
    query: query,
  };
}

function getFormatedFilters(filters: Filter[]): any {
  const filterFormated: { terms: { [x: string]: FilterValue[] } }[] = [];
  filters.forEach((filter: Filter) => {
    if (filter.type === 'none') {
      const matrix = filter.values.map((val: any) => val.split(' - '));
      const values = [].concat(...matrix);
      values.sort();
      const from = values[0];
      const to = values[values.length - 1];

      return {
        range: {
          [filter.field]: {
            gte: from,
            lte: to,
          },
        },
      };
    }
    filterFormated.push({ terms: { [filter.field]: filter.values } });
  });
  return filterFormated;
}
