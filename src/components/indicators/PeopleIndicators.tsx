/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { withSearch } from '@elastic/react-search-ui'
import { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { IoCloudDownloadOutline } from 'react-icons/io5'
import styles from '../../styles/Indicators.module.css'

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'
// @ts-ignore
import { Filter } from '@elastic/search-ui'
import { TagCloud } from 'react-tagcloud'
import ElasticSearchService from '../../services/ElasticSearchService'

import { useTranslation } from 'next-i18next'
import { IndicatorsProps } from '../../types/Propos'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export const optionsResearchArea = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
    },
    title: {
      display: true,
      text: 'Research area(s)',
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
}

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

function PeopleIndicators({
  filters,
  searchTerm,
  isLoading,
  indicatorsState,
}: IndicatorsProps) {
  const { t } = useTranslation('common')

  const [indicators, setIndicators] = useState(indicatorsState.data)

  useEffect(() => {
    optionsResearchArea.plugins.title.text = t(
      optionsResearchArea.plugins?.title?.text
    )
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

  const nationalities: IndicatorType[] = indicators ? indicators[0] : []

  const nationalitiesTagsCloud =
    nationalities != null
      ? nationalities.map((d) => ({ value: d.key, count: d.doc_count }))
      : []

  const researchArea: IndicatorType[] = indicators ? indicators[1] : []

  const researchAreaLabels =
    researchArea != null ? researchArea.map((d) => d.key) : []

  const researchAreaValues =
    researchArea != null ? researchArea.map((d) => d.doc_count) : []

  return (
    <div className={styles.charts}>
      <div className="chart">
        <CSVLink
          className="icon-download d-block"
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
          hidden={researchArea == null || researchArea.length == 0}
          data={{
            labels: researchAreaLabels,
            datasets: [
              {
                data: researchAreaValues,
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

      <div className="chart">
        <p
          style={{
            display:
              nationalities && nationalities.length > 0 ? 'block' : 'none',
          }}
          className={styles.title}
        >
          {t('Nationalities')}
        </p>
        <CSVLink
          className="icon-download d-block"
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
)(PeopleIndicators)
