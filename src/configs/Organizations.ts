/* eslint-disable @typescript-eslint/ban-ts-comment */

import CustomResultViewOrganizations from '../components/customResultView/CustomResultViewOrganizations';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import OrgUnitIndicators from '../components/indicators/OrgUnitIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
import { Index, SortOptionsType } from '../types/Propos';
import indexes from './Indexes';

const indexName = process.env.INDEX_ORGUNIT || '';

const config: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(),
  searchQuery: {
    index: indexName,
    operator: 'OR',
    search_fields: {
      name: {
        weight: 3,
      },
      acronym: {},
      country: {},
      state: {},
      city: {},
    },
    result_fields: {
      id: {
        raw: {},
      },
      name_keyword: {
        raw: {},
      },
      acronym: {
        raw: {},
      },
      country: {
        raw: {},
      },
      state: {
        raw: {},
      },
      city: {
        raw: {},
      },
    },
    facets: {
      country: { type: 'value' },
      state: { type: 'value', size: 27 },
      city: { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        name_suggest: {
          weight: 3,
        },
      },
      result_fields: {
        name_keyword: {
          snippet: {
            size: 100,
            fallback: true,
          },
        },
        vivo_link: {
          raw: {},
        },
      },
    },
    suggestions: {
      types: {
        results: { fields: ['name_completion'] },
      },
      size: 5,
    },
  },
};

const sortOptions: SortOptionsType[] = [
  {
    name: 'Relevance',
    value: [],
  },
  {
    name: 'Nome ASC',
    value: [
      {
        field: 'name',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Nome DESC',
    value: [
      {
        field: 'name',
        direction: 'desc',
      },
    ],
  },
];

const index: Index = {
  config,
  sortOptions,
  name: indexName,
  label: indexes.find((i) => i.name === indexName)?.label || '',
  customView: CustomResultViewOrganizations,
  indicators: OrgUnitIndicators,
  vivoIndexPrefix: 'insti_',
};

export default index;
