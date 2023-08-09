/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { withSearch } from '@elastic/react-search-ui';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import styles from '../../styles/Indicators.module.css';

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
// @ts-ignore
import { Filter } from '@elastic/search-ui';
import { TagCloud } from 'react-tagcloud';
import ElasticSearchService from '../../services/ElasticSearchService';

import { useTranslation } from 'next-i18next';
import { CHART_BACKGROUD_COLORS, CHART_BORDER_COLORS } from '../../../utils/Utils';
import { CustomChartOptions, IndicatorsProps } from '../../types/Propos';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const INDEX_NAME = 'pesqdf-person';

export const optionsResearchArea: CustomChartOptions = {
  title: 'Research areas',
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
    },
    title: {
      display: true,
      text: 'Research areas',
    },
  },
};

type IndicatorType = {
  key: string;
  doc_count: number;
};

const headersNacionality = [
  { label: 'Nacionality', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const headersResearchArea = [
  { label: 'Search area', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const nationtalityQueryBase = {
  track_total_hits: true,
  _source: ['nationality'],
  size: 0,
  aggs: {
    aggregate: {
      terms: {
        field: 'nationality',
        size: 10,
        // order: {
        //   _key: 'desc',
        // },
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

const keywordQueryBase = {
  track_total_hits: true,
  _source: ['researchArea'],
  size: 0,
  aggs: {
    aggregate: {
      terms: {
        field: 'researchArea',
        size: 10,
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

function getKeywordQuery(queryBase: any, filters: any, searchTerm: any, config: any) {
  if (searchTerm) {
    queryBase.query.bool.must.query_string.default_field = Object.keys(config.searchQuery.search_fields)[0];
    queryBase.query.bool.must.query_string.default_operator = config.searchQuery.operator;
    queryBase.query.bool.must.query_string.query = searchTerm;
  } else {
    queryBase.query.bool.must.query_string.query = '*';
  }
  if (filters && filters.length > 0) {
    queryBase.query.bool.filter = [];
    filters.forEach((filter: Filter) => {
      queryBase.query.bool.filter.push({
        terms: { [filter.field]: filter.values },
      });
    });
  } else {
    queryBase.query.bool.filter = [];
  }
  return queryBase;
}

function PeopleIndicators({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }: IndicatorsProps) {
  const { t } = useTranslation('common');

  const [indicators, setIndicators] = useState(indicatorsState.data);

  useEffect(() => {
    // @ts-ignore
    optionsResearchArea.plugins.title.text = t(optionsResearchArea.title);
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(getKeywordQuery(nationtalityQueryBase, filters, searchTerm, indicatorsState.config)),
            JSON.stringify(getKeywordQuery(keywordQueryBase, filters, searchTerm, indicatorsState.config)),
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

  const nationalities: IndicatorType[] = indicators ? indicators[0] : [];

  const nationalitiesTagsCloud =
    nationalities != null ? nationalities.map((d) => ({ value: d.key, count: d.doc_count })) : [];

  const researchArea: IndicatorType[] = indicators ? indicators[1] : [];

  const researchAreaLabels = researchArea != null ? researchArea.map((d) => d.key) : [];

  const researchAreaValues = researchArea != null ? researchArea.map((d) => d.doc_count) : [];

  return (
    <div className={styles.charts}>
      <div className={styles.chart} hidden={researchArea == null || researchArea.length == 0}>
        <CSVLink
          className={styles.download}
          title="Export to csv"
          data={researchArea ? researchArea : []}
          filename={'arquivo.csv'}
          headers={headersResearchArea}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
        // @ts-ignore */
          options={optionsResearchArea}
          data={{
            labels: researchAreaLabels,
            datasets: [
              {
                data: researchAreaValues,
                label: '# People',
                backgroundColor: CHART_BACKGROUD_COLORS,
                borderColor: CHART_BORDER_COLORS,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className={styles.chart} hidden={nationalities == null || nationalities.length == 0}>
        <p
          style={{
            display: nationalities && nationalities.length > 0 ? 'block' : 'none',
          }}
          className={styles.title}
        >
          {t('Nationalities')}
        </p>
        <CSVLink
          className={styles.download}
          title="Exportar para csv"
          data={nationalities ? nationalities : []}
          filename={'arquivo.csv'}
          headers={headersNacionality}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={nationalitiesTagsCloud}
          // @ts-ignore
          style={{
            width: 300,
            textAlign: 'center',
          }}
          randomSeed={42}
          // onClick={(tag: any) =>
          //   alert(`'${JSON.stringify(tag)}' was selected!`)
          // }
        />
      </div>
    </div>
  );
}
// @ts-ignore
export default withSearch(
  // @ts-ignore
  ({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }) => ({
    filters,
    searchTerm,
    isLoading,
    indicatorsState,
    sendDataToParent,
  })
)(PeopleIndicators);
