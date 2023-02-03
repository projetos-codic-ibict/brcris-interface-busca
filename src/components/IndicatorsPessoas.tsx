/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { withSearch } from '@elastic/react-search-ui'
import styles from '../styles/Indicators.module.css'

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
import ElasticSearchService from '../services/ElasticSearchService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export const optionsType = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: true,
    },
    title: {
      display: true,
      text: 'Nacionalidade',
    },
  },
}

export const options = {
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
      text: 'Área de pesquisa',
    },
  },
}

type IndicatorType = {
  key: string
  doc_count: number
}

// @ts-ignore
function Indicators({ filters, searchTerm, isLoading, config }) {
  const [indicators, setIndicators] = useState([])

  useEffect(() => {
    isLoading
      ? ElasticSearchService(
          filters,
          searchTerm,
          Object.keys(config.searchQuery.search_fields)[0],
          config.searchQuery.operator,
          config.searchQuery.index,
          ['nationality.keyword', 'researchArea.keyword']
        ).then((data) => {
          setIndicators(data)
        })
      : null
  }, [
    filters,
    searchTerm,
    isLoading,
    config.searchQuery.search_fields,
    config.searchQuery.operator,
  ])

  const nationalityIndicators: IndicatorType[] = indicators ? indicators[0] : []


  const nationalityLabels =
    nationalityIndicators != null ? nationalityIndicators.map((d) => d.key) : []

  const nationalityValues =
    nationalityIndicators != null
      ? nationalityIndicators.map((d) => d.doc_count)
      : []


  const keywordIndicators: IndicatorType[] = indicators ? indicators[1] : []

  const keywordLabels =
    keywordIndicators != null ? keywordIndicators.map((d) => d.key) : []

  const keywordValues =
    keywordIndicators != null ? keywordIndicators.map((d) => d.doc_count) : []

  return (
    <div className={styles.charts}>
      <Pie
        // hidden={nationalityIndicators == null}
        /** 
      // @ts-ignore */
        options={options}
        width="300"
        data={{
          labels: nationalityLabels,
          datasets: [
            {
              data: nationalityValues,
              label: 'NacionalidadeF',
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

      <Pie
        /** 
      // @ts-ignore */
        options={optionsType}
        hidden={keywordIndicators == null}
        width="500"
        data={{
          labels: keywordLabels,
          datasets: [
            {
              data: keywordValues,
              label: 'Palavra-chave',
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
  )
}
// @ts-ignore
export default withSearch(({ filters, searchTerm, isLoading, config }) => ({
  filters,
  searchTerm,
  isLoading,
  config,
}))(Indicators)
