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

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { CHART_BACKGROUD_COLORS, CHART_BORDER_COLORS } from '../../../utils/Utils';
import ElasticSearchService from '../../services/ElasticSearchService';
import { IndicatorType } from '../../types/Entities';
import { IndicatorsProps } from '../../types/Propos';
import { OptionsBar, OptionsPie } from './options/ChartsOptions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const INDEX_NAME = 'researchgroups';

const optResearchLine = new OptionsPie('Research groups by Research line');
const optKnowledgeArea = new OptionsPie('Research groups by knowledge area');
const optStatus = new OptionsPie('Research groups by status');
const optCreatYear = new OptionsBar('Research groups by creation year');

const headersByCreationYear = [
  { label: 'Creation year', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const headersResearchLine = [
  { label: 'Research line', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];
const headersKnowledgeArea = [
  { label: 'Knowledge Area', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];
const headersStatus = [
  { label: 'Status', key: 'key' },
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

function GroupsIndicators({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }: IndicatorsProps) {
  const [indicators, setIndicators] = useState(indicatorsState.data);
  const { t } = useTranslation('common');

  useEffect(() => {
    // tradução
    // @ts-ignore
    optCreatYear.plugins.title.text = t(optCreatYear.title);
    // @ts-ignore
    optStatus.plugins.title.text = t(optStatus.title);
    // @ts-ignore
    optResearchLine.plugins.title.text = t(optResearchLine.title);
    // @ts-ignore
    optKnowledgeArea.plugins.title.text = t(optKnowledgeArea.title);
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getKeywordQuery(queryCommonBase, 'creationYear', filters, searchTerm, indicatorsState.config)
            ),
            JSON.stringify(getKeywordQuery(queryPie, 'researchLine', filters, searchTerm, indicatorsState.config)),
            JSON.stringify(getKeywordQuery(queryPie, 'knowledgeArea', filters, searchTerm, indicatorsState.config)),
            JSON.stringify(getKeywordQuery(queryPie, 'status', filters, searchTerm, indicatorsState.config)),
          ],
          INDEX_NAME
        ).then((data) => {
          setIndicators(data);
          indicatorsState.data = data;
          sendDataToParent(indicatorsState);
        })
      : null;
  }, [
    filters,
    searchTerm,
    isLoading,
    indicatorsState.config.searchQuery.search_fields,
    indicatorsState.config.searchQuery.operator,
  ]);

  // creation year
  const creationYearIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const creationYearLabels = creationYearIndicators != null ? creationYearIndicators.map((d) => d.key) : [];

  // research line
  const researchLineIndicators: IndicatorType[] = indicators ? indicators[1] : [];
  const researchLineLabels = researchLineIndicators != null ? researchLineIndicators.map((d) => d.key) : [];
  const researchLineCount = researchLineIndicators != null ? researchLineIndicators.map((d) => d.doc_count) : [];

  // knowledge area
  const knowledgeAreaIndicators: IndicatorType[] = indicators ? indicators[2] : [];
  const knowledgeAreaLabels = knowledgeAreaIndicators != null ? knowledgeAreaIndicators.map((d) => d.key) : [];
  const knowledgeAreaCount = knowledgeAreaIndicators != null ? knowledgeAreaIndicators.map((d) => d.doc_count) : [];

  // status
  const statusIndicators: IndicatorType[] = indicators ? indicators[3] : [];
  const statusLabels = statusIndicators != null ? statusIndicators.map((d) => d.key) : [];
  const statusCount = statusIndicators != null ? statusIndicators.map((d) => d.doc_count) : [];

  return (
    <div className={styles.charts}>
      <div className={styles.chart} hidden={creationYearIndicators == null}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={creationYearIndicators ? creationYearIndicators : []}
          filename={'arquivo.csv'}
          headers={headersByCreationYear}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Bar
          /** 
      // @ts-ignore */
          options={optCreatYear}
          width="500"
          data={{
            labels: creationYearLabels,
            datasets: [
              {
                data: creationYearIndicators,
                label: 'Groups by Year',
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart} hidden={researchLineIndicators == null}>
        <CSVLink
          className={styles.download}
          title={t('Export to csv') || ''}
          data={researchLineIndicators ? researchLineIndicators : []}
          filename={'arquivo.csv'}
          headers={headersResearchLine}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
      // @ts-ignore */
          options={optResearchLine}
          width="500"
          data={{
            labels: researchLineLabels,
            datasets: [
              {
                data: researchLineCount,
                label: '# of Votes',
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart} hidden={knowledgeAreaIndicators == null}>
        <CSVLink
          className={styles.download}
          title={t('Export to csv') || ''}
          data={knowledgeAreaIndicators ? knowledgeAreaIndicators : []}
          filename={'arquivo.csv'}
          headers={headersKnowledgeArea}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
      // @ts-ignore */
          options={optKnowledgeArea}
          width="500"
          data={{
            labels: knowledgeAreaLabels,
            datasets: [
              {
                data: knowledgeAreaCount,
                label: '# of codes',
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart} hidden={statusIndicators == null}>
        <CSVLink
          className={styles.download}
          title={t('Export to csv') || ''}
          data={knowledgeAreaIndicators ? knowledgeAreaIndicators : []}
          filename={'arquivo.csv'}
          headers={headersStatus}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
      // @ts-ignore */
          options={optStatus}
          width="500"
          data={{
            labels: statusLabels,
            datasets: [
              {
                data: statusCount,
                label: '# of codes',
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
  ({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }) => ({
    filters,
    searchTerm,
    isLoading,
    indicatorsState,
    sendDataToParent,
  })
)(GroupsIndicators);
