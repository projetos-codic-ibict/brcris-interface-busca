/* eslint-disable @typescript-eslint/ban-ts-comment */

import CustomResultViewSoftwares from '../components/customResultView/CustomResultViewSoftwares';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import SoftwaresIndicators from '../components/indicators/SoftwaresIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
import { Index, SortOptionsType } from '../types/Propos';
import indexes from './Indexes';

const indexName = process.env.INDEX_SOFTWARE || '';

const config: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(),
  searchQuery: {
    index: indexName,
    operator: 'OR',
    search_fields: {
      name_text: {
        weight: 3,
      },
      keyword_text: {},
      depositDate: {},
      releaseYear: {},
      registrationCountry: {},
      platform: {},
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
    disjunctiveFacets: ['depositDate', 'releaseYear'],
    facets: {
      creator: { type: 'value' },
      registrationCountry: { type: 'value' },
      releaseYear: { type: 'value' },
      knowledgeAreas: { type: 'value' },
      language: { type: 'value' },
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
        name: {
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
  text: indexes.find((i) => i.name === indexName)?.text || '',
  customView: CustomResultViewSoftwares,
  indicators: SoftwaresIndicators,
  vivoIndexPrefix: 'softw_',
};

export default index;
