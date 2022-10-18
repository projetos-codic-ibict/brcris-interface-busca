/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import useSWR from 'swr'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import Navbar from '../components/Navbar'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  parsing: {
    xAxisKey: 'key',
    yAxisKey: 'doc_count',
  },
  responsive: true,
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

const fetcher = (...args: any[]) =>
  fetch(...(args as [any])).then((res) => res.json())

export default function Chart() {
  const { data } = useSWR('/api/charts', fetcher)
  const labels = data != null ? data.map((d: any) => d.key) : []
  return (
    <div>
      <Navbar />
      <Bar
        options={options}
        width="500"
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
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
    </div>
  )
}
