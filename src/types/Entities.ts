import type { SearchDriverOptions, SearchQuery } from '@elastic/search-ui';
import { QueryDslOperator } from 'es7/api/types';
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
  period: string;
};

export interface CustomSearchQuery extends SearchQuery {
  operator: QueryDslOperator;
  index: string;
}

export interface CustomSearchDriverOptions extends SearchDriverOptions {
  searchQuery: CustomSearchQuery;
  advanced: boolean;
}

export type QueryItem = {
  field?: string;
  operator?: string;
  value?: string;
};
