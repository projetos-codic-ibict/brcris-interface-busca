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
      name_text: {
        weight: 3,
      },
      'leader.name_text': {},
      'orgunit.name_text': {},
    },
    result_fields: {
      name: {
        raw: {},
      },
      creationYear: {
        raw: {},
      },
      researchLine: {
        raw: {},
      },
      status: {
        raw: {},
      },
      leader: {
        raw: {},
      },
      member: {
        raw: {},
      },
      orgunit: {
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
      'orgunit.name': { type: 'value' },
      status: { type: 'value' },
      'leader.name': { type: 'value' },
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
};

export default index;
