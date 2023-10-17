/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchContext, withSearch } from '@elastic/react-search-ui';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import styles from '../../styles/Indicators.module.css';

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { CHART_BACKGROUD_COLORS, CHART_BORDER_COLORS } from '../../../utils/Utils';
import ElasticSearchService from '../../services/ElasticSearchService';
import { CustomSearchQuery, IndicatorType } from '../../types/Entities';
import { IndicatorsProps } from '../../types/Propos';
import IndicatorContext from '../context/CustomContext';
import { OptionsBar, OptionsPie } from './options/ChartsOptions';
import getFormatedQuery from './query/Query';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const INDEX_NAME = 'pesqdf-publication';
export const options = new OptionsBar('Documents by year');
export const optionsType = new OptionsPie('Documents by type');

const headersPublicationsByYear = [
  { label: 'Year', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const headersType = [
  { label: 'Type', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

function PublicationsIndicators({ filters, searchTerm, isLoading }: IndicatorsProps) {
  const { t } = useTranslation('common');

  const { driver } = useContext(SearchContext);
  const { indicators, setIndicatorsData, isEmpty } = useContext(IndicatorContext);
  const { search_fields, operator } = driver.searchQuery as CustomSearchQuery;
  // @ts-ignore
  const fields = Object.keys(search_fields);

  useEffect(() => {
    // tradução
    // @ts-ignore
    options.plugins.title.text = t(options.title);
    // @ts-ignore
    optionsType.plugins.title.text = t(optionsType.title);
    console.log(isLoading);
    try {
      const pdQuery = JSON.stringify(
        getFormatedQuery({
          size: 10,
          indicadorName: 'publicationDate',
          searchTerm,
          fields,
          operator,
          filters,
          order: { _key: 'desc' },
        })
      );
      const typeQuery = JSON.stringify(
        getFormatedQuery({
          size: 10,
          indicadorName: 'type',
          searchTerm,
          fields,
          operator,
          filters,
        })
      );
      isLoading
        ? ElasticSearchService([pdQuery, typeQuery], INDEX_NAME).then((data) => {
            setIndicatorsData(data);
          })
        : null;
    } catch (err) {
      console.error(err);
      setIndicatorsData([]);
    }
  }, [filters, searchTerm, isLoading]);

  const yearIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const yearLabels = yearIndicators != null ? yearIndicators.map((d) => d.key) : [];
  const typeIndicators: IndicatorType[] = indicators ? indicators[1] : [];
  const typeLabels = typeIndicators != null ? typeIndicators.map((d) => d.key) : [];
  const typeDoc_count = typeIndicators != null ? typeIndicators.map((d) => d.doc_count) : [];

  return (
    <div className={styles.charts} hidden={isEmpty()}>
      <div className={styles.chart}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={yearIndicators ? yearIndicators : []}
          filename={'arquivo.csv'}
          headers={headersPublicationsByYear}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          /** 
      // @ts-ignore */
          options={options}
          width="500"
          data={{
            labels: yearLabels,
            datasets: [
              {
                data: yearIndicators,
                label: 'Articles per Year',
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart}>
        <CSVLink
          className={styles.download}
          title={t('Export to csv') || ''}
          data={typeIndicators ? typeIndicators : []}
          filename={'arquivo.csv'}
          headers={headersType}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
      // @ts-ignore */
          options={optionsType}
          width="500"
          data={{
            labels: typeLabels,
            datasets: [
              {
                data: typeDoc_count,
                label: '# of Votes',
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
export default withSearch(
  // @ts-ignore
  ({ filters, searchTerm, isLoading }) => ({
    filters,
    searchTerm,
    isLoading,
  })
)(PublicationsIndicators);
