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
import IndicatorContext from '../context/CustomContext';
import { OptionsBar } from './options/ChartsOptions';
import getFormatedQuery from './query/Query';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const INDEX_NAME = process.env.INDEX_JOURNAL || '';

const optQualis = new OptionsBar('Journals by qualis');

const headersQualis = [
  { label: 'Qualis', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

function JornalsIndicators({ filters, searchTerm, isLoading }: IndicatorsProps) {
  const { t } = useTranslation('common');

  const { driver } = useContext(SearchContext);
  const { indicators, setIndicatorsData, isEmpty } = useContext(IndicatorContext);
  const { search_fields, operator } = driver.searchQuery as CustomSearchQuery;
  // @ts-ignore
  const fields = Object.keys(search_fields);

  useEffect(() => {
    // tradução
    // @ts-ignore
    optQualis.plugins.title.text = t(optQualis.title);
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getFormatedQuery({
                size: 10,
                indicadorName: 'qualis',
                searchTerm,
                fields,
                operator,
                filters,
              })
            ),
          ],
          INDEX_NAME
        ).then((data) => {
          setIndicatorsData(data);
        })
      : null;
  }, [filters, searchTerm, isLoading]);

  const qualisIndicators: IndicatorType[] = indicators ? indicators[0] : [];

  const qualisLabels = qualisIndicators != null ? qualisIndicators.map((d) => d.key) : [];

  return (
    <div className={styles.charts} hidden={isEmpty()}>
      <div className={styles.chart}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={qualisIndicators ? qualisIndicators : []}
          filename={'arquivo.csv'}
          headers={headersQualis}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          /** 
      // @ts-ignore */
          options={optQualis}
          width="500"
          data={{
            labels: qualisLabels,
            datasets: [
              {
                data: qualisIndicators,
                label: 'Articles per Year',
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
)(JornalsIndicators);
