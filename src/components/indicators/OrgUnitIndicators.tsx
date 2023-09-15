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
import { Bar } from 'react-chartjs-2';
import { CHART_BACKGROUD_COLORS, CHART_BORDER_COLORS } from '../../../utils/Utils';
import ElasticSearchService from '../../services/ElasticSearchService';
import { CustomSearchQuery, IndicatorType } from '../../types/Entities';
import { IndicatorsProps } from '../../types/Propos';
import IndicatorContext from '../context/IndicatorsContext';
import { OptionsBar } from './options/ChartsOptions';
import getFormatedQuery from './query/Query';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const INDEX_NAME = 'pesqdf-orgunit';

const options = new OptionsBar('Institutions by country');
const optionsState = new OptionsBar('Institutions by state');

const headersOrgUnit = [
  { label: 'Country', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];
const headersOrgUnitState = [
  { label: 'State', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

function OrgUnitIndicators({ filters, searchTerm, isLoading }: IndicatorsProps) {
  const { t } = useTranslation('common');

  const { driver } = useContext(SearchContext);
  const { indicators, setIndicatorsData, isEmpty } = useContext(IndicatorContext);
  console.log('indicators', indicators);

  const { search_fields, operator } = driver.searchQuery as CustomSearchQuery;
  // @ts-ignore
  const fields = Object.keys(search_fields);

  useEffect(() => {
    // tradução
    // @ts-ignore
    options.plugins.title.text = t(options.title);
    // @ts-ignore
    optionsState.plugins.title.text = t(optionsState.title);

    const countryQuery = JSON.stringify(
      getFormatedQuery({
        size: 10,
        indicadorName: 'country',
        searchTerm,
        fields,
        operator,
        filters,
      })
    );
    const stateQuery = JSON.stringify(
      getFormatedQuery({
        size: 10,
        indicadorName: 'state',
        searchTerm,
        fields,
        operator,
        filters,
      })
    );
    isLoading
      ? ElasticSearchService([countryQuery, stateQuery], INDEX_NAME).then((data) => {
          setIndicatorsData(data);
        })
      : null;
  }, [filters, searchTerm, isLoading]);

  const countryIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const countryLabels = countryIndicators != null ? countryIndicators.map((d) => d.key) : [];

  const stateIndicators: IndicatorType[] = indicators ? indicators[1] : [];
  const stateLabels = stateIndicators != null ? stateIndicators.map((d) => d.key) : [];

  return (
    <div className={styles.charts} hidden={isEmpty()}>
      <div className={styles.chart}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={countryIndicators ? countryIndicators : []}
          filename={'arquivo.csv'}
          headers={headersOrgUnit}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          /** 
      // @ts-ignore */
          options={options}
          width="500"
          data={{
            labels: countryLabels,
            datasets: [
              {
                data: countryIndicators,
                label: t('Institutions') || '',
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart} hidden={stateIndicators == null}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={stateIndicators ? stateIndicators : []}
          filename={'arquivo.csv'}
          headers={headersOrgUnitState}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          /** 
      // @ts-ignore */
          options={optionsState}
          width="500"
          data={{
            labels: stateLabels,
            datasets: [
              {
                data: stateIndicators,
                label: t('Institutions') || '',
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
)(OrgUnitIndicators);
