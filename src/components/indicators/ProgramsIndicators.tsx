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
import { Bar } from 'react-chartjs-2';
import ElasticSearchService from '../../services/ElasticSearchService';
import { IndicatorsProps } from '../../types/Propos';
import {
  CHART_BACKGROUD_COLORS,
  CHART_BORDER_COLORS,
} from '../../../utils/Utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const options: ChartOptions = {
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
      text: 'Program by OrgUnit',
    },
  },
  scales: {
    x: {
      ticks: {
        display: false,
      },
    },
  },
};

type IndicatorType = {
  key: string;
  doc_count: number;
};

const headersOrgUnit = [
  { label: 'Organization', key: 'key' },
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
        size: 10,
        order: {
          _count: 'desc',
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

function PublicationsIndicators({
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
    options.plugins.title.text = t(options.plugins?.title?.text);
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getKeywordQuery(
                queryCommonBase,
                'orgunit.name',
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

  const orgUnitIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const orgUnitLabels =
    orgUnitIndicators != null ? orgUnitIndicators.map((d) => d.key) : [];

  return (
    <div className={styles.charts}>
      <div className={styles.chart}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={orgUnitIndicators ? orgUnitIndicators : []}
          filename={'arquivo.csv'}
          headers={headersOrgUnit}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          hidden={orgUnitIndicators == null}
          /** 
      // @ts-ignore */
          options={options}
          width="500"
          data={{
            labels: orgUnitLabels,
            datasets: [
              {
                data: orgUnitIndicators,
                label: t('Programs') || '',
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
  ({ filters, searchTerm, isLoading, indicatorsState }) => ({
    filters,
    searchTerm,
    isLoading,
    indicatorsState,
  })
)(PublicationsIndicators);