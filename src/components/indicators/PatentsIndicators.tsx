/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { withSearch } from '@elastic/react-search-ui';
import { Filter } from '@elastic/search-ui';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import styles from '../../styles/Indicators.module.css';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ElasticSearchService from '../../services/ElasticSearchService';
import { IndicatorsProps } from '../../types/Propos';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const optCountryCode = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
    },
    title: {
      display: true,
      text: 'Patents by country code',
    },
  },
};
export const optKindCode = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
    },
    title: {
      display: true,
      text: 'Patents by kind code',
    },
  },
};

export const optDepositDate: ChartOptions = {
  parsing: {
    xAxisKey: 'key',
    yAxisKey: 'doc_count',
  },
  responsive: true,
  aspectRatio: 1,
  plugins: {
    legend: {
      position: 'bottom',
      display: false,
    },
    title: {
      display: true,
      text: 'Patents by deposit year',
    },
  },
};

export const optPubDate: ChartOptions = {
  parsing: {
    xAxisKey: 'key',
    yAxisKey: 'doc_count',
  },
  responsive: true,
  aspectRatio: 1,
  plugins: {
    legend: {
      position: 'bottom',
      display: false,
    },
    title: {
      display: true,
      text: 'Patents by publication year',
    },
  },
};

type IndicatorType = {
  key: string;
  doc_count: number;
};

const headersByDepositDate = [
  { label: 'Deposit year', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const headersBypublicationDate = [
  { label: 'Publication year', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const headersCountryCode = [
  { label: 'Country code', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];
const headersKindCode = [
  { label: 'Kind code', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const queryCommonBase = {
  track_total_hits: true,
  _source: [],
  size: 0,
  aggs: {
    aggregate: {
      terms: {
        field: '',
        size: 100,
        order: {
          _key: 'desc',
        },
      },
    },
  },
  query: {
    bool: {
      must: {
        query_string: {
          query: '*',
        },
      },
      filter: [],
    },
  },
};

const queryPie = JSON.parse(JSON.stringify(queryCommonBase));
// queryPie.aggs.aggregate.terms.size = 10
queryPie.aggs.aggregate.terms.order = { _count: 'desc' };

function getKeywordQuery(
  queryBase: any,
  indicador: string,
  filters: any,
  searchTerm: any,
  config: any
) {
  const field = Object.keys(config.searchQuery.search_fields)[0];
  if (indicador) {
    queryBase._source = [indicador];
    queryBase.aggs.aggregate.terms.field = indicador;
  }

  if (searchTerm) {
    queryBase.query.bool.must.query_string.default_field = field;
    queryBase.query.bool.must.query_string.default_operator =
      config.searchQuery.operator;
    queryBase.query.bool.must.query_string.query = searchTerm;
  } else {
    queryBase.query.bool.must.query_string.query = '*';
  }
  if (filters && filters.length > 0) {
    queryBase.query.bool.filter = [];
    filters.forEach((filter: Filter) => {
      queryBase.query.bool.filter.push(getFilterFormated(filter));
    });
  } else {
    queryBase.query.bool.filter = [];
  }
  return queryBase;
}

function getFilterFormated(filter: Filter): any {
  if (filter.type === 'none') {
    const matrix = filter.values.map((val: any) => val.split(' - '));
    const values = [].concat(...matrix);
    values.sort();
    const from = values[0];
    const to = values[values.length - 1];

    return {
      range: {
        [filter.field]: {
          gte: from,
          lte: to,
        },
      },
    };
  }
  return { terms: { [filter.field]: filter.values } };
}

function PatentsIndicators({
  filters,
  searchTerm,
  isLoading,
  indicatorsState,
}: IndicatorsProps) {
  const [indicators, setIndicators] = useState(indicatorsState.data);
  const { t } = useTranslation('common');

  useEffect(() => {
    // tradução
    // @ts-ignore
    optDepositDate.plugins.title.text = t(optDepositDate.plugins?.title?.text);
    // @ts-ignore
    optPubDate.plugins.title.text = t(optPubDate.plugins?.title?.text);
    optCountryCode.plugins.title.text = t(optCountryCode.plugins?.title?.text);
    optKindCode.plugins.title.text = t(optKindCode.plugins?.title?.text);
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getKeywordQuery(
                queryCommonBase,
                'depositDate',
                filters,
                searchTerm,
                indicatorsState.config
              )
            ),
            JSON.stringify(
              getKeywordQuery(
                queryCommonBase,
                'publicationDate',
                filters,
                searchTerm,
                indicatorsState.config
              )
            ),
            JSON.stringify(
              getKeywordQuery(
                queryPie,
                'countryCode',
                filters,
                searchTerm,
                indicatorsState.config
              )
            ),
            JSON.stringify(
              getKeywordQuery(
                queryPie,
                'kindCode',
                filters,
                searchTerm,
                indicatorsState.config
              )
            ),
          ],
          indicatorsState.config.searchQuery.index
        ).then((data) => {
          setIndicators(data);
          indicatorsState.data = data;
        })
      : null;
  }, [
    filters,
    searchTerm,
    isLoading,
    indicatorsState.config.searchQuery.search_fields,
    indicatorsState.config.searchQuery.operator,
  ]);

  // deposite date
  const depositeDateIndicators: IndicatorType[] = indicators
    ? indicators[0]
    : [];
  const depositeDateLabels =
    depositeDateIndicators != null
      ? depositeDateIndicators.map((d) => d.key)
      : [];
  //  publication date
  const publicationDateIndicators: IndicatorType[] = indicators
    ? indicators[1]
    : [];
  const publicationDateLabels =
    publicationDateIndicators != null
      ? publicationDateIndicators.map((d) => d.key)
      : [];

  // country Code
  const countryCodeIndicators: IndicatorType[] = indicators
    ? indicators[2]
    : [];
  const countryCodeLabels =
    countryCodeIndicators != null
      ? countryCodeIndicators.map((d) => d.key)
      : [];
  const countryCodeCount =
    countryCodeIndicators != null
      ? countryCodeIndicators.map((d) => d.doc_count)
      : [];

  // kind Code
  const kindCodeIndicators: IndicatorType[] = indicators ? indicators[3] : [];
  const kindCodeLabels =
    kindCodeIndicators != null ? kindCodeIndicators.map((d) => d.key) : [];
  const kindCodeCount =
    kindCodeIndicators != null
      ? kindCodeIndicators.map((d) => d.doc_count)
      : [];

  return (
    <div className={styles.charts}>
      <div className={styles.chart}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={depositeDateIndicators ? depositeDateIndicators : []}
          filename={'arquivo.csv'}
          headers={headersByDepositDate}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          hidden={depositeDateIndicators == null}
          /** 
      // @ts-ignore */
          options={optDepositDate}
          width="500"
          data={{
            labels: depositeDateLabels,
            datasets: [
              {
                data: depositeDateIndicators,
                label: 'Articles per Year',
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)',
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)',
                ],
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={publicationDateIndicators ? publicationDateIndicators : []}
          filename={'arquivo.csv'}
          headers={headersByDepositDate}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          hidden={headersBypublicationDate == null}
          /** 
      // @ts-ignore */
          options={optPubDate}
          width="500"
          data={{
            labels: publicationDateLabels,
            datasets: [
              {
                data: publicationDateIndicators,
                label: 'Articles per Year',
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)',
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)',
                ],
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
          data={countryCodeIndicators ? countryCodeIndicators : []}
          filename={'arquivo.csv'}
          headers={headersCountryCode}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
      // @ts-ignore */
          options={optCountryCode}
          hidden={countryCodeIndicators == null}
          width="500"
          data={{
            labels: countryCodeLabels,
            datasets: [
              {
                data: countryCodeCount,
                label: '# of Votes',
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
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
          data={kindCodeIndicators ? kindCodeIndicators : []}
          filename={'arquivo.csv'}
          headers={headersKindCode}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
      // @ts-ignore */
          options={optKindCode}
          hidden={kindCodeIndicators == null}
          width="500"
          data={{
            labels: kindCodeLabels,
            datasets: [
              {
                data: kindCodeCount,
                label: '# of codes',
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
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
  ({ filters, searchTerm, isLoading, indicatorsState }) => ({
    filters,
    searchTerm,
    isLoading,
    indicatorsState,
  })
)(PatentsIndicators);
