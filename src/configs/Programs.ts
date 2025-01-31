/* eslint-disable @typescript-eslint/ban-ts-comment */

import CustomResultViewPeople from '../components/customResultView/CustomResultViewPrograms';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import ProgramsIndicators from '../components/indicators/ProgramsIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
import { Index, SortOptionsType } from '../types/Propos';
import indexes from './Indexes';

const indexName = process.env.INDEX_PROGRAM || '';

const config: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(),
  searchQuery: {
    index: indexName,
    operator: 'OR',
    search_fields: {
      name_text: {},
      'orgunit.name': {},
    },
    result_fields: {
      name: {
        raw: {},
      },
      orgunit: {
        raw: [],
      },
      capesResearchArea: {
        raw: {},
      },
      cnpqResearchArea: {
        raw: {},
      },
      evaluationArea: {
        raw: {},
      },
    },
    disjunctiveFacets: ['name', 'capesResearchArea'],
    facets: {
      name: { type: 'value' },
      capesResearchArea: { type: 'value' },
      cnpqResearchArea: { type: 'value' },
      'orgunit.name': { type: 'value' },
      evaluationArea: { type: 'value' },
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
      size: 4,
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
  customView: CustomResultViewPeople,
  indicators: ProgramsIndicators,
  vivoIndexPrefix: 'gprog_',
};

export default index;
