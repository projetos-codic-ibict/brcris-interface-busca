/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter, FilterValue } from '@elastic/search-ui';
type QueryProps = {
  size: number;
  indicadorName: string;
  searchTerm: string;
  fields: string[];
  operator: boolean;
  filters: [];
  order?: string;
};
export default function getFormatedQuery({
  size,
  indicadorName,
  searchTerm,
  fields,
  operator,
  filters,
  order = '_key',
}: QueryProps) {
  return {
    track_total_hits: true,
    _source: [indicadorName],
    size: 0,
    aggs: {
      aggregate: {
        terms: {
          field: indicadorName,
          size: size,
          order: {
            [order]: 'desc',
          },
        },
      },
    },
    query: {
      bool: {
        must: {
          query_string: {
            query: searchTerm || '*',
            default_operator: operator,
            fields: fields,
          },
        },
        filter: filters && filters.length > 0 ? getFormatedFilters(filters) : [],
      },
    },
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
