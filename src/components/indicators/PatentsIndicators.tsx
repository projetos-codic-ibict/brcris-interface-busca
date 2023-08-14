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
const INDEX_NAME = 'pesqdf-patent';

const optDepositDate = new OptionsBar('Patents by deposit year');
const optPubDate = new OptionsBar('Patents by publication year');
const optCountryCode = new OptionsPie('Patents by country code');
const optKindCode = new OptionsPie('Patents by kind code');

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

function PatentsIndicators({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }: IndicatorsProps) {
  const [indicators, setIndicators] = useState(indicatorsState.data);
  const { t } = useTranslation('common');

  useEffect(() => {
    // tradução
    // @ts-ignore
    optDepositDate.plugins.title.text = t(optDepositDate.title);
    // @ts-ignore
    optPubDate.plugins.title.text = t(optPubDate.title);
    // @ts-ignore
    optCountryCode.plugins.title.text = t(optCountryCode.title);
    // @ts-ignore
    optKindCode.plugins.title.text = t(optKindCode.title);
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getKeywordQuery(queryCommonBase, 'depositDate', filters, searchTerm, indicatorsState.config)
            ),
            JSON.stringify(
              getKeywordQuery(queryCommonBase, 'publicationDate', filters, searchTerm, indicatorsState.config)
            ),
            JSON.stringify(getKeywordQuery(queryPie, 'countryCode', filters, searchTerm, indicatorsState.config)),
            JSON.stringify(getKeywordQuery(queryPie, 'kindCode', filters, searchTerm, indicatorsState.config)),
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

  // deposite date
  const depositeDateIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const depositeDateLabels = depositeDateIndicators != null ? depositeDateIndicators.map((d) => d.key) : [];
  //  publication date
  const publicationDateIndicators: IndicatorType[] = indicators ? indicators[1] : [];
  const publicationDateLabels = publicationDateIndicators != null ? publicationDateIndicators.map((d) => d.key) : [];

  // country Code
  const countryCodeIndicators: IndicatorType[] = indicators ? indicators[2] : [];
  const countryCodeLabels = countryCodeIndicators != null ? countryCodeIndicators.map((d) => d.key) : [];
  const countryCodeCount = countryCodeIndicators != null ? countryCodeIndicators.map((d) => d.doc_count) : [];

  // kind Code
  const kindCodeIndicators: IndicatorType[] = indicators ? indicators[3] : [];
  const kindCodeLabels = kindCodeIndicators != null ? kindCodeIndicators.map((d) => d.key) : [];
  const kindCodeCount = kindCodeIndicators != null ? kindCodeIndicators.map((d) => d.doc_count) : [];

  return (
    <div className={styles.charts}>
      <div className={styles.chart} hidden={depositeDateIndicators == null}>
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
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart} hidden={headersBypublicationDate == null}>
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
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart} hidden={countryCodeIndicators == null}>
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
          width="500"
          data={{
            labels: countryCodeLabels,
            datasets: [
              {
                data: countryCodeCount,
                label: '# of Votes',
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart} hidden={kindCodeIndicators == null}>
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
          width="500"
          data={{
            labels: kindCodeLabels,
            datasets: [
              {
                data: kindCodeCount,
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
)(PatentsIndicators);
