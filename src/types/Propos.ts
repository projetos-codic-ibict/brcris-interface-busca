/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartOptions } from 'chart.js';

export type IndicatorsProps = {
  filters?: any;
  searchTerm?: any;
  isLoading?: any;
};

export interface CustomChartOptions extends ChartOptions {
  title: string; // este campo é somente para ser usado na tradução
}
