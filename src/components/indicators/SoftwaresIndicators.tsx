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
import { CHART_BACKGROUD_COLORS, CHART_BORDER_COLORS } from '../../../utils/Utils';
import ElasticSearchService from '../../services/ElasticSearchService';
import { IndicatorsProps } from '../../types/Propos';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const optknowledgeAreas = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
    },
    title: {
      display: true,
      text: 'Softwares by knowledge areas',
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
      text: 'Softwares by release year',
    },
  },
};

type IndicatorType = {
  key: string;
  doc_count: number;
};

const headersByReleaseYear = [
  { label: 'Release year', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const headersKnowledgeAreas = [
  { label: 'Knowledge areas', key: 'key' },
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
queryPie.aggs.aggregate.terms.size = 10;
queryPie.aggs.aggregate.terms.order = { _count: 'desc' };

function getKeywordQuery(queryBase: any, indicador: string, filters: any, searchTerm: any, config: any) {
  const field = Object.keys(config.searchQuery.search_fields)[0];
  if (indicador) {
    queryBase._source = [indicador];
    queryBase.aggs.aggregate.terms.field = indicador;
  }

  if (searchTerm) {
    queryBase.query.bool.must.query_string.default_field = field;
    queryBase.query.bool.must.query_string.default_operator = config.searchQuery.operator;
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

function SoftwaresIndicators({ filters, searchTerm, isLoading, indicatorsState }: IndicatorsProps) {
  const [indicators, setIndicators] = useState(indicatorsState.data);
  const { t } = useTranslation('common');

  useEffect(() => {
    // tradução
    // @ts-ignore
    optPubDate.plugins.title.text = t(optPubDate.plugins?.title?.text);
    optknowledgeAreas.plugins.title.text = t(optknowledgeAreas.plugins?.title?.text);
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getKeywordQuery(queryCommonBase, 'releaseYear', filters, searchTerm, indicatorsState.config)
            ),
            JSON.stringify(getKeywordQuery(queryPie, 'knowledgeAreas', filters, searchTerm, indicatorsState.config)),
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

  //  release date
  const releaseYearIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const releaseYearLabels = releaseYearIndicators != null ? releaseYearIndicators.map((d) => d.key) : [];

  // country Code
  const knowledgeAreasIndicators: IndicatorType[] = indicators ? indicators[1] : [];
  const knowledgeAreasLabels = knowledgeAreasIndicators != null ? knowledgeAreasIndicators.map((d) => d.key) : [];
  const knowledgeAreasCount = knowledgeAreasIndicators != null ? knowledgeAreasIndicators.map((d) => d.doc_count) : [];

  return (
    <div className={styles.charts}>
      <div className={styles.chart}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={releaseYearIndicators ? releaseYearIndicators : []}
          filename={'arquivo.csv'}
          headers={headersByReleaseYear}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          hidden={headersByReleaseYear == null}
          /** 
      // @ts-ignore */
          options={optPubDate}
          width="500"
          data={{
            labels: releaseYearLabels,
            datasets: [
              {
                data: releaseYearIndicators,
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
          data={knowledgeAreasIndicators ? knowledgeAreasIndicators : []}
          filename={'arquivo.csv'}
          headers={headersKnowledgeAreas}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
      // @ts-ignore */
          options={optknowledgeAreas}
          hidden={knowledgeAreasIndicators == null}
          width="500"
          data={{
            labels: knowledgeAreasLabels,
            datasets: [
              {
                data: knowledgeAreasCount,
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
  ({ filters, searchTerm, isLoading, indicatorsState }) => ({
    filters,
    searchTerm,
    isLoading,
    indicatorsState,
  })
)(SoftwaresIndicators);
