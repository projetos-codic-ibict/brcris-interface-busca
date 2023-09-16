import type { SearchDriverOptions, SearchQuery } from '@elastic/search-ui';
export type Author = {
  id: string;
  name: string;
  idLattes?: string;
  nationality?: string;
};
export type OrgUnit = {
  id: string;
  name: string;
};

export type Service = {
  id: string;
  title: string[];
};

export type IndicatorType = {
  key: string;
  doc_count: number;
};

export type MemberType = {
  name: string;
  image: string;
  lattes: string;
};

export interface CustomSearchQuery extends SearchQuery {
  operator: 'AND' | 'OR';
  advanced?: boolean;
  advancedQuery?: string;
}

export interface CustomSearchDriverOptions extends SearchDriverOptions {
  searchQuery: CustomSearchQuery;
}

export type AdvancedFieldType = {
  field: string;
  op: string;
  value: string;
};
