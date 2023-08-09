import { ChartOptions } from 'chart.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type IndicatorsProps = {
  filters?: any;
  searchTerm?: any;
  isLoading?: any;
  indicatorsState: any;
  sendDataToParent: (indicatorsState: any) => void;
};

export interface CustomChartOptions extends ChartOptions {
  title: string; // este campo é somente para ser usado na tradução
}
