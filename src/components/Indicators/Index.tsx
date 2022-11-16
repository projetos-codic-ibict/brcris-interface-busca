/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import useSWR, { Key } from 'swr'
import { withSearch } from '@elastic/react-search-ui'
// import { Filter } from '@elastic/search-ui'

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
import { SearchContextState } from '@elastic/react-search-ui/lib/esm/withSearch'

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
      position: 'bottom' as const,
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
      position: 'bottom' as const,
      display: false,
    },
    title: {
      display: true,
      text: 'Artigos por ano',
    },
  },
}

const fetcher = (args: any) =>
  !args.url
    ? null
    : fetch(args.url, {
        body: JSON.stringify(args.params),
        method: 'POST',
      }).then((res) => res.json())

let cache: any[] = []

function ListenFilters({ filters, searchTerm, isLoading }: SearchContextState) {
  const apiUrl: Key = '/api/indicators'

  let indicatorsBuckets: any[] = []

  indicatorsBuckets = useYearIndicators(
    !isLoading && cache?.length > 0 ? null : apiUrl,
    filters,
    searchTerm
  )
  console.log('indicatorsBuckets', indicatorsBuckets)
  if (indicatorsBuckets) {
    // para evitar que fique fazendo consultas a toda mudança de estado
    // agora só faz consulta de dados para o gráfico quando realizar busca de documentos, isLoading = true
    cache = indicatorsBuckets
  } else {
    indicatorsBuckets = cache
  }

  const yearIndicators = indicatorsBuckets ? indicatorsBuckets[0] : []

  const yearLabels =
    yearIndicators != null ? yearIndicators.map((d: any) => d.key) : []

  const typeIndicators = indicatorsBuckets ? indicatorsBuckets[1] : []

  const typeLabels =
    typeIndicators != null ? typeIndicators.map((d: any) => d.key) : []
  const typeDoc_count =
    typeIndicators != null ? typeIndicators.map((d: any) => d.doc_count) : []

  return (
    <div className="container">
      <Bar
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

export default withSearch(({ filters, searchTerm, isLoading }) => ({
  filters,
  searchTerm,
  isLoading,
}))(ListenFilters)

function useYearIndicators(
  url: string | null,
  filters: any,
  searchTerm: any
): any {
  const { data } = useSWR(
    {
      url,
      params: [
        {
          filters,
          searchTerm,
          indicator: 'publicationDate.keyword',
        },
        { filters, searchTerm, indicator: 'type.keyword' },
      ],
    },
    fetcher
  )
  return data
}
