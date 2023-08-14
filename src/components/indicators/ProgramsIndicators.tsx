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
import { Bar } from 'react-chartjs-2';
import { CHART_BACKGROUD_COLORS, CHART_BORDER_COLORS } from '../../../utils/Utils';
import ElasticSearchService from '../../services/ElasticSearchService';
import { IndicatorType } from '../../types/Entities';
import { IndicatorsProps } from '../../types/Propos';
import { OptionsBar } from './options/ChartsOptions';
import getFormatedQuery from './query/Query';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const INDEX_NAME = 'pesqdf-program';

export const options = new OptionsBar('Program by OrgUnit', false);

const headersOrgUnit = [
  { label: 'Organization', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
];

function ProgramsIndicators({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }: IndicatorsProps) {
  const [indicators, setIndicators] = useState(indicatorsState.data);
  const { t } = useTranslation('common');

  useEffect(() => {
    // tradução
    // @ts-ignore
    options.plugins.title.text = t(options.title);
    const fields = Object.keys(indicatorsState.config.searchQuery.search_fields);
    const operator = indicatorsState.config.searchQuery.operator;
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getFormatedQuery({
                size: 10,
                indicadorName: 'orgunit.name',
                searchTerm,
                fields,
                operator,
                filters,
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

  const orgUnitIndicators: IndicatorType[] = indicators ? indicators[0] : [];
  const orgUnitLabels = orgUnitIndicators != null ? orgUnitIndicators.map((d) => d.key) : [];

  return (
    <div className={styles.charts}>
      <div className={styles.chart} hidden={orgUnitIndicators == null}>
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
  ({ filters, searchTerm, isLoading, indicatorsState, sendDataToParent }) => ({
    filters,
    searchTerm,
    isLoading,
    indicatorsState,
    sendDataToParent,
  })
)(ProgramsIndicators);
