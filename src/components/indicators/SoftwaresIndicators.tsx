/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { withSearch } from '@elastic/react-search-ui';
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
import getFormatedQuery from './query/Query';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const INDEX_NAME = 'pesqdf-software';

const optPubDate = new OptionsBar('Softwares by release year');
const optknowledgeAreas = new OptionsPie('Softwares by knowledge area');

const headersByReleaseYear = [
  { label: 'Release year', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

const headersKnowledgeAreas = [
  { label: 'Knowledge area', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

function SoftwaresIndicators({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }: IndicatorsProps) {
  const [indicators, setIndicators] = useState(indicatorsState.data);
  const { t } = useTranslation('common');

  useEffect(() => {
    // tradução
    // @ts-ignore
    optPubDate.plugins.title.text = t(optPubDate.title);
    // @ts-ignore
    optknowledgeAreas.plugins.title.text = t(optknowledgeAreas.title);
    const fields = Object.keys(indicatorsState.config.searchQuery.search_fields);
    const operator = indicatorsState.config.searchQuery.operator;

    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getFormatedQuery({
                size: 1000,
                indicadorName: 'releaseYear',
                searchTerm,
                fields,
                operator,
                filters,
              })
            ),
            JSON.stringify(
              getFormatedQuery({
                size: 10,
                indicadorName: 'knowledgeAreas',
                searchTerm,
                fields,
                operator,
                filters,
                order: '_count',
              })
            ),
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

  //  release date
  const releaseYearIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const releaseYearLabels = releaseYearIndicators != null ? releaseYearIndicators.map((d) => d.key) : [];

  // country Code
  const knowledgeAreasIndicators: IndicatorType[] = indicators ? indicators[1] : [];
  const knowledgeAreasLabels = knowledgeAreasIndicators != null ? knowledgeAreasIndicators.map((d) => d.key) : [];
  const knowledgeAreasCount = knowledgeAreasIndicators != null ? knowledgeAreasIndicators.map((d) => d.doc_count) : [];

  return (
    <div className={styles.charts}>
      <div className={styles.chart} hidden={headersByReleaseYear == null}>
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

      <div className={styles.chart} hidden={knowledgeAreasIndicators == null}>
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
  ({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }) => ({
    filters,
    searchTerm,
    isLoading,
    indicatorsState,
    sendDataToParent,
  })
)(SoftwaresIndicators);
