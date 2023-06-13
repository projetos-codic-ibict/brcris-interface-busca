/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-explicit-any */

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import 'vis-network/styles/vis-network.css'
// @ts-ignore
const Graph = dynamic(import('react-graph-vis'), { ssr: false })
// import { Edge, Node, Options } from 'vis-network'/
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Node } from 'vis'
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
    index: 'pesqdf-publication',
    label: 'Publications',
    title: '40.565 ',
    widthConstraint: 100,
    level: 1,
    shape: 'circle',
    color: '#F7964D',
    font: {
      color: '#210d41',
      size: 13,
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
      color: '#210d41',
      size: 13,
    },
  },
  {
    id: 3,
    index: 'pesqdf-journals',
    label: 'Journals',
    title: '253 ',
    level: 3,
    shape: 'circle',
    color: '#FF5757',
    font: {
      color: '#210d41',
      size: 13,
    },
  },
  {
    id: 4,
    index: 'pesqdf-orgunit',
    label: 'Institutions',
    title: '140 ',
    level: 4,
    shape: 'circle',
    color: '#00dafc',
    font: {
      color: '#210d41',
      size: 13,
    },
  },
  {
    id: 5,
    index: 'pesqdf-patent',
    label: 'Patentes',
    title: '253 ',
    level: 5,
    shape: 'circle',
    color: '#960080',
    font: {
      color: '#210d41',
      size: 13,
    },
  },
  {
    id: 6,
    index: 'pesqdf-program',
    label: 'Programs',
    title: '253 ',
    level: 6,
    shape: 'circle',
    color: '#20c997',
    font: {
      color: '#210d41',
      size: 12,
    },
  },
  // {
  //   id: 7,
  //   index: '',
  //   label: 'Research Groups',
  //   title: '253 ',
  //   level: 7,
  //   shape: 'circle',
  //   color: '#6610f2',
  //   font: {
  //     color: '#ffffff',
  //   },
  // },
  // {
  //   id: 8,
  //   index: '',
  //   label: 'Software',
  //   title: '253 ',
  //   level: 8,
  //   shape: 'circle',
  //   color: '#6f42c1',
  //   font: {
  //     color: '#ffffff',
  //   },
  // },
]

const keysLanguage = [
  'Publications',
  'People',
  'Journals',
  'Institutions',
  'Patents',
  'Programs',
  // 'Research Groups',
  // 'Software',
]

const edges = [
  { from: 1, to: 2, id: 1 },
  { from: 1, to: 4, id: 2 },
  { from: 3, to: 4, id: 3 },
  { from: 4, to: 2, id: 4 },
  { from: 1, to: 3, id: 5 },
  { from: 3, to: 2, id: 6 },
  { from: 6, to: 1, id: 7 },
  { from: 6, to: 2, id: 8 },
  { from: 6, to: 4, id: 9 },
  { from: 5, to: 2, id: 10 },
  { from: 5, to: 4, id: 11 },
  // { from: 7, to: 8, id: 8 },
  // { from: 1, to: 7, id: 9 },
  // { from: 8, to: 5, id: 10 },
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
    size: 32,
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
    `/${router.locale}/journals`,
    `/${router.locale}/institutions`,
    `/${router.locale}/patents`,
    `/${router.locale}/programs`,
    `/${router.locale}/groups`,
    `/${router.locale}/software`,
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
        console.log(res)
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
        console.log(nodes[i].label, indexStat.index, indexStat['docs.count'])
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
