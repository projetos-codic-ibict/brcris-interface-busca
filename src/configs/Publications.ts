/* eslint-disable @typescript-eslint/ban-ts-comment */

import CustomResultViewPublications from '../components/customResultView/CustomResultViewPublications';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import PublicationsIndicators from '../components/indicators/PublicationsIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
import { Index, SortOptionsType } from '../types/Propos';
import indexes from './Indexes';

const indexName = process.env.INDEX_PUBLICATION || '';

const config: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(),
  searchQuery: {
    operator: 'OR',
    index: indexName,
    advanced_fields: {
      publicationDate: {},
      language: {},
      type: {},
      'orgunit.name': {},
    },
    search_fields: {
      title: {
        weight: 3,
      },
      'author.name': {},
    },
    result_fields: {
      advisor: {
        raw: {},
      },
      author: {
        raw: [],
      },
      coadvisor: {
        raw: {},
      },
      conference: {
        raw: {},
      },
      course: {
        raw: {},
      },
      doi: {
        raw: {},
      },
      journal: {
        raw: {},
      },
      keyword_keyword: {
        snippet: {},
      },
      language: {
        raw: [],
      },
      openalexId: {
        raw: [],
      },
      orgunit: {
        snippet: {},
      },
      program: {
        snippet: {},
      },
      publicationDate: {
        snippet: {},
      },
      researchArea: {
        raw: [],
      },
      service: {
        raw: {},
      },
      title_keyword: {
        snippet: {},
      },
      type: {
        raw: {},
      },
      year: {
        raw: {},
      },
    },
    disjunctiveFacets: [
      'language.type',
      'author.name_keyword',
      'keyword.type',
      'cnpqResearchArea.type',
      'publicationDate.type',
      'course.name_keyword',
      'program.name_keyword',
      'conference.name_keyword',
    ],

    facets: {
      language: { type: 'value' },
      'author.name_keyword': { type: 'value' },
      keyword_keyword: { type: 'value' },
      'orgunit.name_keyword': { type: 'value' },
      'journal.title_keyword': { type: 'value' },
      type: { type: 'value' },
      'course.name_keyword': { type: 'value' },
      'program.name_keyword': { type: 'value' },
      'conference.name_keyword': { type: 'value' },
      researchArea: { type: 'value' },
      publicationDate: {
        type: 'range',
        ranges: [
          {
            from: '2024',
            to: new Date().getUTCFullYear().toString(),
            name: `2024 - ${new Date().getUTCFullYear()}`,
          },
          {
            from: '2021',
            to: '2023',
            name: '2021 - 2023',
          },
          {
            from: '2016',
            to: '2020',
            name: '2016 - 2020',
          },
          {
            from: '2011',
            to: '2015',
            name: '2011 - 2015',
          },
          {
            from: '2001',
            to: '2010',
            name: '2001 - 2010',
          },
          {
            from: '1991',
            to: '2000',
            name: '1991 - 2000',
          },
          {
            from: '1950',
            to: '1990',
            name: '1950 - 1990',
          },
        ],
      },
    },
  },
  autocompleteQuery: {
    results: {
      // @ts-ignore foi adiciona o index aqui para não dar erro no autocomplete
      index: indexName,
      resultsPerPage: 6,
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
    name: 'Ano ASC',
    value: [
      {
        field: 'publicationDate',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Ano DESC',
    value: [
      {
        field: 'publicationDate',
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
  customView: CustomResultViewPublications,
  indicators: PublicationsIndicators,
  vivoIndexPrefix: 'publ_',
};
export default index;
