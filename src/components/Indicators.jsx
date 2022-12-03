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
import { Bar, Pie } from 'react-chartjs-2'
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
      text: 'Tipos de documentos',
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
      text: 'Artigos por ano',
    },
  },
}

function Indicators({ filters, searchTerm, isLoading, config }) {
  const [indicators, setIndicators] = useState([])

  useEffect(() => {
    isLoading
      ? ElasticSearchService(
          filters,
          searchTerm,
          Object.keys(config.searchQuery.search_fields)[0],
          config.searchQuery.operator
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

  const yearIndicators = indicators ? indicators[0] : []

  const yearLabels =
    yearIndicators != null ? yearIndicators.map((d) => d.key) : []

  const typeIndicators = indicators ? indicators[1] : []

  const typeLabels =
    typeIndicators != null ? typeIndicators.map((d) => d.key) : []
  const typeDoc_count =
    typeIndicators != null ? typeIndicators.map((d) => d.doc_count) : []

  return (
    <div className={styles.charts}>
      <Bar
        hidden={yearIndicators == null}
        options={options}
        width="500"
        data={{
          labels: yearLabels,
          datasets: [
            {
              data: yearIndicators,
              label: 'Artigos por ano',
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
      />

      <Pie
        options={optionsType}
        hidden={typeIndicators == null}
        width="500"
        data={{
          labels: typeLabels,
          datasets: [
            {
              data: typeDoc_count,
              label: '# of Votes',
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

export default withSearch(({ filters, searchTerm, isLoading, config }) => ({
  filters,
  searchTerm,
  isLoading,
  config,
}))(Indicators)
