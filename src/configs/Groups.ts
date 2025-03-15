/* eslint-disable @typescript-eslint/ban-ts-comment */

import CustomResultViewGroups from '../components/customResultView/CustomResultViewGroups';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import GroupsIndicators from '../components/indicators/GroupsIndicators';
import { CustomSearchDriverOptions } from '../types/Entities';
import { Index, SortOptionsType } from '../types/Propos';
import indexes from './Indexes';

const indexName = process.env.INDEX_GROUP || '';

const config: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(),
  searchQuery: {
    index: indexName,
    operator: 'OR',
    advanced_fields: {
      creationYear: {},
      status: {},
    },
    search_fields: {
      name: {
        weight: 3,
      },
      'leader.name': {},
      'member.name': {},
      'orgunit.name': {},
    },
    result_fields: {
      name_keyword: {
        raw: {},
      },
      creationYear: {
        raw: {},
      },
      researchLine: {
        raw: {},
      },
      knowledgeArea: {
        raw: {},
      },
      description: {
        raw: {},
      },
      applicationSector: {
        raw: {},
      },
      keyword: {
        raw: [],
      },
      URL: {
        raw: {},
      },
      status: {
        raw: {},
      },
      leader: {
        raw: {},
      },
      partner: {
        raw: {},
      },
      member: {
        raw: {},
      },
      orgunit: {
        raw: {},
      },
      software: {
        raw: {},
      },
      equipment: {
        raw: {},
      },
    },
    disjunctiveFacets: [
      'creationYear',
      'researchLine',
      'knowledgeArea',
      'orgunit',
      'keyword',
      'status',
      'leader',
      'partner',
      'member',
      'applicationSector',
    ],
    facets: {
      creationYear: { type: 'value' },
      researchLine: { type: 'value' },
      knowledgeArea: { type: 'value' },
      'orgunit.name_keyword': { type: 'value' },
      keyword_keyword: { type: 'value' },
      status: { type: 'value' },
      'leader.name_keyword': { type: 'value' },
      'partner.name_keyword': { type: 'value' },
      member: { type: 'value' },
      applicationSector: { type: 'value' },
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
  customView: CustomResultViewGroups,
  indicators: GroupsIndicators,
  vivoIndexPrefix: 'resgr_',
};

export default index;
