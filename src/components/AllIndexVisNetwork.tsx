/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
// @ts-ignore
const Graph = dynamic(import('react-graph-vis'), { ssr: false })
import 'vis-network/styles/vis-network.css'
// import { Edge, Node, Options } from 'vis-network'/
import { useTranslation } from 'next-i18next'
import { Node } from 'vis'
import { useRouter } from 'next/router'
import ElasticSearchStatsService from '../services/ElasticSearchStatsService'

type IndexStat = {
  index: string
  'docs.count': number
}

interface IndexNode extends Node {
  index: string
}

// Exemplo https://codesandbox.io/s/vis-test-fhir-test-2-forked-0m1l1x?file=/src/index.js:1774-1820
const nodes: IndexNode[] = [
  {
    id: 1,
    label: 'Publications',
    title: '40.565 ',
    widthConstraint: 100,
    index: 'pesqdf-publication',
    level: 1,
    shape: 'circle',
    color: '#F7964D',
    font: {
      color: '#ffffff',
    },
  },
  {
    id: 2,
    index: 'pesqdf-person',
    label: 'People',
    size: 200,
    title: '10.00 ',
    level: 2,
    shape: 'circle',
    color: '#CB6CE6',
    font: {
      color: '#ffffff',
    },
  },
  {
    id: 3,
    index: 'pesqdf-orgunit',
    label: 'Institutions',
    title: '140 ',
    level: 3,
    shape: 'circle',
    color: '#00dafc',
  },
  {
    id: 4,
    index: 'pesqdf-journals',
    label: 'Journals',
    title: '253 ',
    level: 4,
    shape: 'circle',
    color: '#FF5757',
    font: {
      color: '#ffffff',
    },
  },
]

const keysLanguage = ['Publications', 'People', 'Institutions', 'Journals']

const edges = [
  { from: 1, to: 2, id: 1 },
  { from: 1, to: 4, id: 3 },
  // { from: 2, to: 3, id: 2 },
  // { from: 2, to: 4, id: 14 },
  // { from: 1, to: 4, id: 3 },
  { from: 3, to: 4, id: 12 },

  // { from: 4, to: 5, id: 6 },
  { from: 4, to: 2, id: 13 },
  { from: 1, to: 3, id: 2 },
  { from: 3, to: 2, id: 7 },
  { from: 1, to: 5, id: 8 },

  { from: 7, to: 8, id: 9 },
  { from: 1, to: 7, id: 10 },
  { from: 8, to: 8, id: 11 },
]

const options = {
  // autoResize: true,
  height: '500px',
  width: '100%',
  edges: {
    color: '#fff',
    smooth: {
      enabled: true,
      type: 'continuous',
      roundness: 0,
    },
  },
  nodes: {
    shape: 'dot',
    size: 64,
  },
  interaction: {
    // dragNodes: false,
    // dragView: false,
    hover: true,
    // zoomView: false,
  },
  layout: {
    hierarchical: {
      enabled: false,
      nodeSpacing: 100,
    },
  },
}

function getSizeOfNode(maxSize: number, sizeOfDocsOfNode: number) {
  const originalSizeOfNode = (sizeOfDocsOfNode / maxSize) * 100
  const minValue = 70
  const maxValue = 100
  const totalDifference = maxValue - minValue
  const scaleFactor = originalSizeOfNode / maxValue
  const adjustedValue = scaleFactor * totalDifference + minValue
  return adjustedValue
}

function VisGraph() {
  const router = useRouter()
  const [graph, setGraph] = useState({ nodes, edges })
  const [indexesStats, setIndexesStats] = useState<IndexStat[]>([])
  const { t } = useTranslation('common')
  const numberFormat = new Intl.NumberFormat('pt-BR')

  const pages = [
    `/${router.locale}/publications`,
    `/${router.locale}/people`,
    `/${router.locale}/institutions`,
    `/${router.locale}/journals`,
  ]

  const events = {
    click: function (event: any) {
      if (event.nodes[0] && pages[event.nodes[0] - 1]) {
        window.location.href = pages[event.nodes[0] - 1]
      }
    },
  }

  useEffect(() => {
    ElasticSearchStatsService()
      .then((res) => {
        setIndexesStats(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    const newNodes: IndexNode[] = []
    const maxSizeOfNode = Math.max(
      ...indexesStats.map((item) => item['docs.count'])
    )
    for (let i = 0; i < keysLanguage.length; i++) {
      const indexStat = indexesStats.find(
        (item) => item.index === nodes[i].index
      )
      if (indexStat) {
        nodes[i].title = `${numberFormat.format(indexStat['docs.count'])} `
        nodes[i].widthConstraint = getSizeOfNode(
          maxSizeOfNode,
          indexStat['docs.count']
        )
      }
      // @ts-ignore
      nodes[i].label = t(keysLanguage[i])
      // @ts-ignore
      if (!nodes[i].title?.includes(nodes[i].label)) {
        // @ts-ignore
        nodes[i].title += nodes[i].label
      }
      newNodes.push({ ...nodes[i] })
    }

    setGraph({ ...graph, nodes: newNodes })
  }, [t, indexesStats])

  return (
    <section className="graph">
      {/**
             // @ts-ignore */}
      <Graph graph={graph} options={options} events={events} />
    </section>
  )
}

export default VisGraph
