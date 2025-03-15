/* eslint-disable @typescript-eslint/ban-ts-comment */

import CustomResultViewPatents from '../components/customResultView/CustomResultViewPatents';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import PatentsIndicators from '../components/indicators/PatentsIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
import { Index, SortOptionsType } from '../types/Propos';
import indexes from './Indexes';

const indexName = process.env.INDEX_PATENT || '';

const config: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(),
  searchQuery: {
    index: indexName,
    operator: 'OR',
    advanced_fields: {
      publicationDate: {},
      depositDate: {},
      kindCode: {},
      countryCode: {},
    },
    search_fields: {
      espacenetTitle: {},
      'inventor.name': {},
    },
    result_fields: {
      id: {
        raw: {},
      },
      espacenetTitle_keyword: {
        raw: {},
      },
      applicant: {
        raw: [],
      },
      depositDate: {
        raw: {},
      },
      kindCode: {
        raw: {},
      },
      countryCode: {
        raw: {},
      },
      lattesTitle: {
        raw: [],
      },
      publicationDate: {
        raw: [],
      },
      inventor: {
        raw: [],
      },
    },
    disjunctiveFacets: [
      'countryCode',
      'publicationDate',
      'depositDate',
      'inventor',
      'espacenetTitle_keyword',
      'inventor.name_keyword',
    ],
    facets: {
      countryCode: { type: 'value' },
      publicationDate: { type: 'value' },
      depositDate: { type: 'value' },
      'inventor.name_keyword': { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        espacenetTitle_suggest: {
          weight: 3,
        },
      },
      result_fields: {
        espacenetTitle_keyword: {
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
        results: { fields: ['espacenetTitle_completion'] },
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
  customView: CustomResultViewPatents,
  indicators: PatentsIndicators,
  vivoIndexPrefix: 'pat_',
};

export default index;
