/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import useSWR, { Key } from 'swr'
import { withSearch } from '@elastic/react-search-ui'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export const options = {
  parsing: {
    xAxisKey: 'key',
    yAxisKey: 'doc_count',
  },
  responsive: true,
  aspectRatio: 1,
  plugins: {
    legend: {
      position: 'bottom' as const,
      display: false,
    },
    title: {
      display: true,
      text: 'Tipos de documentos',
    },
  },
}

const fetcher = (args: any) =>
  fetch(args.url, {
    body: JSON.stringify(args.params),
    method: 'POST',
  }).then((res) => res.json())

const apiUrl: Key = '/api/charts'
function ListenFilters({ filters, searchTerm }) {
  const { data } = useSWR(
    {
      url: apiUrl,
      params: { filters, searchTerm, indicator: 'type.keyword' },
    },
    fetcher
  )

  const labels = data != null ? data.map((d: any) => d.key) : []
  return (
    <div className="container">
      <Pie
        // options={options}
        width="500"
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
              label: 'Tipos de documentos',
            },
          ],
        }}
      />
    </div>
  )
}

export default withSearch(({ filters, searchTerm }) => ({
  filters,
  searchTerm,
}))(ListenFilters)
