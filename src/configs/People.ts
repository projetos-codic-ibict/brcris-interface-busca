/* eslint-disable @typescript-eslint/ban-ts-comment */

import CustomResultViewPeople from '../components/customResultView/CustomResultViewPeople';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import PeopleIndicators from '../components/indicators/PeopleIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
import { Index, SortOptionsType } from '../types/Propos';
import indexes from './Indexes';

const indexName = process.env.INDEX_PERSON || '';

const config: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(),
  searchQuery: {
    operator: 'OR',
    index: indexName,
    advanced_fields: {
      'orgunit.name': {},
      lattesId: {},
    },
    search_fields: {
      name: {},
    },
    result_fields: {
      id: {
        raw: {},
      },
      name_keyword: {
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
    disjunctiveFacets: ['nationality', 'researchArea'],
    facets: {
      nationality: { type: 'value' },
      'researchArea.name_keyword': { type: 'value' },
      'orgunit.name_keyword': { type: 'value' },
      'community.name_keyword': { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      // @ts-ignore foi adiciona o index aqui para não dar erro no autocomplete
      index: indexName,
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
  customView: CustomResultViewPeople,
  indicators: PeopleIndicators,
  vivoIndexPrefix: 'pers_',
};

export default index;
