/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views';
import { ChartOptions } from 'chart.js';
import { ComponentType } from 'react';
import { CustomSearchDriverOptions } from './Entities';
export type IndicatorsProps = {
  filters?: any;
  searchTerm?: any;
  isLoading?: any;
};

export interface CustomChartOptions extends ChartOptions {
  title: string; // este campo é somente para ser usado na tradução
}

export type SortOptionsType = {
  name: string;
  value: any[];
};

export type Index = {
  config: CustomSearchDriverOptions;
  sortOptions: SortOptionsType[];
  name: string;
  label: string;
  customView: ComponentType<ResultViewProps>;
  indicators: ComponentType<any>;
  vivoIndexPrefix: string;
};
