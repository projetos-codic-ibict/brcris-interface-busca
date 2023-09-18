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
import { Bar, Pie } from 'react-chartjs-2';
import { CHART_BACKGROUD_COLORS, CHART_BORDER_COLORS } from '../../../utils/Utils';
import ElasticSearchService from '../../services/ElasticSearchService';
import { CustomSearchQuery, IndicatorType } from '../../types/Entities';
import { IndicatorsProps } from '../../types/Propos';
import IndicatorContext from '../context/CustomContext';
import { OptionsBar, OptionsPie } from './options/ChartsOptions';
import getFormatedQuery from './query/Query';

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

function PatentsIndicators({ filters, searchTerm, isLoading }: IndicatorsProps) {
  const { t } = useTranslation('common');

  const { driver } = useContext(SearchContext);
  const { indicators, setIndicatorsData, isEmpty } = useContext(IndicatorContext);
  const { search_fields, operator } = driver.searchQuery as CustomSearchQuery;
  // @ts-ignore
  const fields = Object.keys(search_fields);

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
              getFormatedQuery({
                size: 10,
                indicadorName: 'depositDate',
                searchTerm,
                fields,
                operator,
                filters,
                order: { _key: 'desc' },
              })
            ),
            JSON.stringify(
              getFormatedQuery({
                size: 10,
                indicadorName: 'publicationDate',
                searchTerm,
                fields,
                operator,
                filters,
                order: { _key: 'desc' },
              })
            ),
            JSON.stringify(
              getFormatedQuery({
                size: 10,
                indicadorName: 'countryCode',
                searchTerm,
                fields,
                operator,
                filters,
              })
            ),
            JSON.stringify(
              getFormatedQuery({
                size: 10,
                indicadorName: 'kindCode',
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
    <div className={styles.charts} hidden={isEmpty()}>
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
  ({ filters, searchTerm, isLoading }) => ({
    filters,
    searchTerm,
    isLoading,
  })
)(PatentsIndicators);
