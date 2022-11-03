/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from 'react'
import { Options, Edge, Node } from 'vis-network'

import useVisNetwork from './useVisNetwork'

import useSWR from 'swr'

const nodesTest: any[] = [
  {
    id: '1',
    institutions: [
      {
        id: '1',
        name: 'Fiocruz',
      },
      {
        id: '2',
        name: 'São Paulo',
      },
    ],
  },
  {
    id: '2',
    institutions: [
      {
        id: '2',
        name: 'São Paulo',
      },
      {
        id: '1',
        name: 'Fiocruz',
      },
    ],
  },
  {
    id: '3',
    institutions: [
      {
        id: '3',
        name: 'Pernambuco',
      },
      {
        id: '1',
        name: 'Fiocruz',
      },
    ],
  },
  {
    id: '4',
    institutions: [
      {
        id: '1',
        name: 'Fiocruz',
      },
      {
        id: '3',
        name: 'Pernambuco',
      },
      {
        id: '2',
        name: 'São Paulo',
      },
    ],
  },
  {
    id: '5',
    institutions: [
      {
        id: '2',
        name: 'São Paulo',
      },
    ],
  },
  {
    id: '6',
    institutions: [
      {
        id: '3',
        name: 'Pernambuco',
      },
    ],
  },
  {
    id: '7',
    institutions: [
      {
        id: '4',
        name: 'Piaui',
      },
    ],
  },
]

const nodes: Node[] = []
const edges: Edge[] = []
nodesTest.forEach((paper) => {
  if (paper.institutions.length > 1) {
    for (let i = 0; i < paper.institutions.length - 1; i++) {
      for (let k = i + 1; k < paper.institutions.length; k++) {
        const existedEdge = edges.find(
          (edge) =>
            (edge.from == paper.institutions[i].id &&
              edge.to == paper.institutions[k].id) ||
            (edge.to == paper.institutions[i].id &&
              edge.from == paper.institutions[k].id)
        )
        if (existedEdge) {
          existedEdge.width = existedEdge.width + 1
          existedEdge.label = '' + existedEdge.width
        } else {
          const newEdge: Edge = {
            id: paper.id,
            from: paper.institutions[i].id,
            to: paper.institutions[k].id,
            width: 1,
            label: '1',
          }
          edges.push(newEdge)
        }
      }
    }
  }
  paper.institutions.forEach((inst) => {
    addNode(inst)
  })
})

function addNode(inst: any) {
  const existedNode = nodes.find((node) => node.id == inst.id)
  if (existedNode) {
    existedNode.size = existedNode.size ? existedNode.size + 1 : 1
  } else {
    const newNode: Node = {
      id: inst.id,
      label: inst.name,
      size: 1,
    }
    nodes.push(newNode)
  }
}

console.log('nodes: ', nodes)
console.log('edges: ', edges)

// const nodes: Node[] = [
//   {
//     id: 1,
//     label: 'um',
//     title: 'um ',
//     size: 5,
//   },
//   {
//     id: 2,
//     label: 'dois',
//     title: '2',
//     size: 20,
//   },
//   {
//     id: 3,
//     label: 'tres',
//     title: '3',
//     size: 10,
//   },
// ]

// const edges: Edge[] = [
//   { from: 1, to: 2, id: 1, width: 2, label: '2' },
//   { from: 2, to: 3, id: 2, width: 5, label: '5' },
// ]

const options: Options = {
  interaction: {
    selectable: true,
    selectConnectedEdges: true,
  },
  edges: {
    smooth: {
      enabled: true,
      type: 'diagonalCross',
      roundness: 0.5,
    },
  },
  nodes: {
    shape: 'dot',
  },
  layout: {
    hierarchical: {
      enabled: true,
    },
  },
}

export default () => {
  /* const fetcher = (...args: Array<any>) =>
    fetch(...(args as [any])).then((res) => res.json())

  const { data } = useSWR('/api/visNetwork', fetcher)
  const articles = data
  let notas = []

  if (articles !== undefined || articles !== null) {
    for (let article of articles) {
      for (let institution of article._source.institutions) {
        if (institution.id !== nodes[article._source.institutions[institution]]?.id) {
          notas.push({ id: institution.id, label: institution.name })
        }
      }
    }
    //console.log('123', data[1]._source.institutions)
    console.log('teste: ', notas)
  } */

  const { ref, network } = useVisNetwork({
    options,
    edges,
    nodes,
  })

  const handleClick = () => {
    if (!network) return

    network.focus(5)
  }

  useEffect(() => {
    if (!network) return
    network.once('beforeDrawing', () => {
      network.focus(1)
    })
    // network.setSelection({
    //   edges: [1, 2],
    //   nodes: [1, 2, 3],
    // })
  }, [network])

  return (
    <>
      <button onClick={handleClick}>Focus</button>
      <div style={{ height: 700, width: '100%' }} ref={ref} />
    </>
  )
}
