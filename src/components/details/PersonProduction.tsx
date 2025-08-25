/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import styles from '../../styles/Indicators.module.css';

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { CHART_BACKGROUD_COLORS, CHART_BORDER_COLORS } from '../../../utils/Utils';
import ElasticSearchService from '../../services/ElasticSearchService';
import { IndicatorType } from '../../types/Entities';
import IndicatorContext from '../context/CustomContext';
import { OptionsBar, OptionsPie } from '../indicators/options/ChartsOptions';
import { getAggregateQuery } from '../indicators/query/Query';
import { Filter } from '@elastic/search-ui';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const INDEX_NAME = process.env.INDEX_PUBLICATION || '';
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

export default function PersonProduction({ authorId }: { authorId: string }) {
  const { t } = useTranslation('common');

  const { indicators, setIndicatorsData, isEmpty } = useContext(IndicatorContext);
  const [total, setTotal] = useState([]);

  // @ts-ignore
  const fields = ['author.id'];
  const searchTerm = authorId;
  const filters: Filter[] = [];
  const operator = 'AND';

  console.log('searchTerm', searchTerm);

  useEffect(() => {
    // tradução
    // @ts-ignore
    options.plugins.title.text = t(options.title);
    // @ts-ignore
    optionsType.plugins.title.text = t(optionsType.title);
    try {
      const pdQuery = JSON.stringify(
        getAggregateQuery({
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
        getAggregateQuery({
          size: 10,
          indicadorName: 'type',
          searchTerm,
          fields,
          operator,
          filters,
        })
      );
      ElasticSearchService([pdQuery, typeQuery], INDEX_NAME).then((data) => {
        console.log('data', data);
        setTotal(data.total);
        setIndicatorsData(data.buckets);
      });
    } catch (err) {
      console.error(err);
      setIndicatorsData([]);
    }
  }, [authorId]);

  const yearIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const yearLabels = yearIndicators != null ? yearIndicators.map((d) => d.key) : [];
  const typeIndicators: IndicatorType[] = indicators ? indicators[1] : [];
  const typeLabels = typeIndicators != null ? typeIndicators.map((d) => d.key) : [];
  const typeDoc_count = typeIndicators != null ? typeIndicators.map((d) => d.doc_count) : [];

  yearIndicators && yearIndicators.sort((a, b) => Number(a.key) - Number(b.key));

  return (
    <div className={styles.charts} hidden={isEmpty()}>
      <div className={styles.chart}>
        {/* @ts-ignore */}
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
        <span>Total: {total[0]}</span>
      </div>

      <div className={styles.chart}>
        {/* @ts-ignore */}
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
        <span>Total: {total[1]}</span>
      </div>
    </div>
  );
}
