/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { withSearch } from '@elastic/react-search-ui'
import styles from '../styles/Indicators.module.css'

import { CSVLink } from 'react-csv'
import { IoCloudDownloadOutline } from 'react-icons/io5'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'
// @ts-ignore
import { TagCloud } from 'react-tagcloud'
import ElasticSearchService from '../services/ElasticSearchService'
import { Filter } from '@elastic/search-ui'

import { useTranslation } from 'next-i18next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export const optionsKey = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
    },
    title: {
      display: true,
      text: 'Search area - Top 10',
    },
  },
}

export const optionsNat = {
  parsing: {
    xAxisKey: 'key',
    yAxisKey: 'doc_count',
  },
  responsive: true,
  aspectRatio: 1,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
    },
    title: {
      display: true,
      text: 'Nacionality - Top 10',
    },
  },
}

type IndicatorType = {
  key: string
  doc_count: number
}

const headersNacionality = [
  { label: 'Nacionality', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
]

const headersResearchArea = [
  { label: 'Search area', key: 'key' },
  { label: 'Quantity', key: 'doc_count' },
]

const nationtalityQueryBase = {
  track_total_hits: true,
  _source: ['nationality.keyword'],
  size: 0,
  aggs: {
    aggregate: {
      terms: {
        field: 'nationality.keyword',
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
}

const keywordQueryBase = {
  track_total_hits: true,
  _source: ['researchArea.keyword'],
  size: 0,
  aggs: {
    aggregate: {
      terms: {
        field: 'researchArea.keyword',
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
}

function getKeywordQuery(
  queryBase: any,
  filters: any,
  searchTerm: any,
  config: any
) {
  if (searchTerm) {
    queryBase.query.bool.must.query_string.default_field = Object.keys(
      config.searchQuery.search_fields
    )[0]
    queryBase.query.bool.must.query_string.default_operator =
      config.searchQuery.operator
    queryBase.query.bool.must.query_string.query = searchTerm
  } else {
    queryBase.query.bool.must.query_string.query = '*'
  }
  if (filters && filters.length > 0) {
    queryBase.query.bool.filter = []
    filters.forEach((filter: Filter) => {
      queryBase.query.bool.filter.push({
        terms: { [filter.field]: filter.values },
      })
    })
  } else {
    queryBase.query.bool.filter = []
  }
  return queryBase
}

// @ts-ignore
function Indicators({ filters, searchTerm, isLoading, indicatorsState }) {
  const { t } = useTranslation('common')

  const [indicators, setIndicators] = useState(indicatorsState.data)

  useEffect(() => {
    isLoading
      ? ElasticSearchService(
          [
            JSON.stringify(
              getKeywordQuery(
                nationtalityQueryBase,
                filters,
                searchTerm,
                indicatorsState.config
              )
            ),
            JSON.stringify(
              getKeywordQuery(
                keywordQueryBase,
                filters,
                searchTerm,
                indicatorsState.config
              )
            ),
          ],
          indicatorsState.config.searchQuery.index
        ).then((data) => {
          setIndicators(data)
          indicatorsState.data = data
        })
      : null
  }, [
    filters,
    searchTerm,
    isLoading,
    indicatorsState.config.searchQuery.search_fields,
    indicatorsState.config.searchQuery.operator,
  ])

  const nationalityIndicators: IndicatorType[] = indicators ? indicators[0] : []

  const nationalitys =
    nationalityIndicators != null
      ? nationalityIndicators.map((d) => ({ value: d.key, count: d.doc_count }))
      : []

  const researchAreaIndicators: IndicatorType[] = indicators
    ? indicators[0]
    : []

  // const nationalityLabels =
  //   nationalityIndicators != null ? nationalityIndicators.map((d) => d.key) : []

  // const nationalityValues =
  //   nationalityIndicators != null
  //     ? nationalityIndicators.map((d) => d.doc_count)
  //     : []

  const keywordIndicators: IndicatorType[] = indicators ? indicators[1] : []
  // const keywords =
  //   keywordIndicators != null
  //     ? keywordIndicators.map((d) => ({ value: d.key, count: d.doc_count }))
  //     : []

  const keywordLabels =
    keywordIndicators != null ? keywordIndicators.map((d) => d.key) : []

  const keywordValues =
    keywordIndicators != null ? keywordIndicators.map((d) => d.doc_count) : []

  return (
    <div className={styles.charts}>
      <div className="chart">
        <CSVLink
          className="icon-download d-block"
          title="Exportar para csv"
          data={nationalityIndicators ? nationalityIndicators : []}
          filename={'arquivo.csv'}
          headers={headersNacionality}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <p
          style={{
            display: nationalitys && nationalitys.length > 0 ? 'block' : 'none',
          }}
          className="text-center"
        >
          {t('Nacionality')} - Top 10
        </p>
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={nationalitys}
          style={{
            width: 300,
            textAlign: 'center',
          }}
          randomSeed={42}
          onClick={(tag: any) => alert(`'${tag.value}' was selected!`)}
        />

        {/* <Bar
          hidden={nationalityIndicators == null}
          options={optionsNat}
          width="300"
          data={{
            labels: nationalityLabels,
            datasets: [
              {
                data: nationalityValues,
                label: 'Pessoas',
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
        /> */}
      </div>

      <div className="chart">
        <CSVLink
          className="icon-download d-block"
          title="Export to csv"
          data={researchAreaIndicators ? researchAreaIndicators : []}
          filename={'arquivo.csv'}
          headers={headersResearchArea}
        >
          <IoCloudDownloadOutline />
        </CSVLink>
        <Pie
          /** 
        // @ts-ignore */
          options={optionsKey}
          hidden={keywordIndicators == null || keywordIndicators.length == 0}
          width="300"
          data={{
            labels: keywordLabels,
            datasets: [
              {
                data: keywordValues,
                label: '# People',
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
  )
}
// @ts-ignore
export default withSearch(
   // @ts-ignore
  ({ filters, searchTerm, isLoading, indicatorsState }) => ({
    filters,
    searchTerm,
    isLoading,
    indicatorsState,
  })
)(Indicators)
