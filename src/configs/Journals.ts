/* eslint-disable @typescript-eslint/ban-ts-comment */

import CustomResultViewJournals from '../components/customResultView/CustomResultViewJournals';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import JornalsIndicators from '../components/indicators/JornalsIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
import { Index, SortOptionsType } from '../types/Propos';
import indexes from './Indexes';

const indexName = process.env.INDEX_JOURNAL || '';

const config: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(),
  searchQuery: {
    index: indexName,
    operator: 'OR',
    search_fields: {
      title: {},
      issn: {},
      issnl: {},
      status: {},
      qualis: {},
      type: {},
    },

    result_fields: {
      id: {
        raw: {},
      },
      title_keyword: {
        raw: {},
      },
      accessType: {
        raw: {},
      },
      issn: {
        raw: {},
      },
      issnl: {
        raw: {},
      },
      keywords: {
        raw: {},
      },
      status: {
        raw: {},
      },
      qualis: {
        raw: {},
      },
      type: {
        raw: {},
      },
      H5index: {
        raw: {},
      },
      publisher: {
        raw: [],
      },
    },
    disjunctiveFacets: ['status', 'publisher.name'],

    facets: {
      qualis: { type: 'value' },
      status: { type: 'value' },
      type: { type: 'value' },
      'publisher.name_keyword': { type: 'value' },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        title_suggest: {
          weight: 3,
        },
      },
      result_fields: {
        title_keyword: {
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
        results: { fields: ['title_completion'] },
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
    name: 'Title ASC',
    value: [
      {
        field: 'title',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Title DESC',
    value: [
      {
        field: 'title',
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
  customView: CustomResultViewJournals,
  indicators: JornalsIndicators,
  vivoIndexPrefix: 'journ_',
};

export default index;
