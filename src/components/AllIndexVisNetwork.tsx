/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Edge, Node, Options } from 'vis';
import 'vis-network/styles/vis-network.css';
import indexes from '../configs/Indexes';
import ElasticSearchStatsService from '../services/ElasticSearchStatsService';
// @ts-ignore
const Graph = dynamic(import('react-graph-vis'), { ssr: false });

type IndexStat = {
  index: string;
  'docs.count': number;
};

interface IndexNode extends Node {
  index: string;
  indexText: string;
}

// Exemplo https://codesandbox.io/s/vis-test-fhir-test-2-forked-0m1l1x?file=/src/index.js:1774-1820
const nodes: IndexNode[] = [
  {
    id: 1,
    index: process.env.INDEX_PUBLICATION || '',
    indexText: indexes.find((i) => i.name === process.env.INDEX_PUBLICATION)?.text || '',
    label: '',
    title: '100',
    widthConstraint: 130,
    level: 1,
    shape: 'circle',
    color: 'orange',
    font: {
      color: '#fff',
      size: 14,
    },
  },
  {
    id: 2,
    index: process.env.INDEX_PERSON || '',
    indexText: indexes.find((i) => i.name === process.env.INDEX_PERSON)?.text || '',
    label: '',
    size: 200,
    title: '100',
    widthConstraint: 100,
    level: 2,
    shape: 'circle',
    color: '#009688',
    font: {
      color: '#fff',
      size: 14,
    },
  },
  {
    id: 3,
    index: process.env.INDEX_JOURNAL || '',
    indexText: indexes.find((i) => i.name === process.env.INDEX_JOURNAL)?.text || '',
    label: '',
    title: '100',
    widthConstraint: 80,
    level: 3,
    shape: 'circle',
    color: '#FF5757',
    font: {
      color: '#fff',
      size: 14,
    },
  },
  {
    id: 4,
    index: process.env.INDEX_ORGUNIT || '',
    indexText: indexes.find((i) => i.name === process.env.INDEX_ORGUNIT)?.text || '',
    label: '',
    title: '100',
    widthConstraint: 60,
    level: 4,
    shape: 'circle',
    color: '#960080',
    font: {
      color: '#fff',
      size: 14,
    },
  },
  {
    id: 5,
    index: process.env.INDEX_PATENT || '',
    indexText: indexes.find((i) => i.name === process.env.INDEX_PATENT)?.text || '',
    label: '',
    title: '100',
    widthConstraint: 85,
    level: 5,
    shape: 'circle',
    color: '#03a9f4',
    font: {
      color: '#fff',
      size: 14,
    },
  },
  {
    id: 6,
    index: process.env.INDEX_PROGRAM || '',
    indexText: indexes.find((i) => i.name === process.env.INDEX_PROGRAM)?.text || '',
    label: '',
    title: '100',
    widthConstraint: 70,
    level: 6,
    shape: 'circle',
    color: '#CB6CE6',
    font: {
      color: '#fff',
      size: 14,
    },
  },
  {
    id: 7,
    index: process.env.INDEX_GROUP || '',
    indexText: indexes.find((i) => i.name === process.env.INDEX_GROUP)?.text || '',
    label: '',
    title: '100',
    widthConstraint: 70,
    level: 7,
    shape: 'circle',
    color: '#6610f2',
    font: {
      color: '#fff',
      size: 14,
    },
  },
  {
    id: 8,
    index: process.env.INDEX_SOFTWARE || '',
    indexText: indexes.find((i) => i.name === process.env.INDEX_SOFTWARE)?.text || '',
    label: '',
    title: '100 ',
    widthConstraint: 70,
    level: 8,
    shape: 'circle',
    color: '#6f42c1',
    font: {
      color: '#fff',
      size: 14,
    },
  },
];

const edges: Edge = [
  { from: 1, to: 2, id: 1 },
  { from: 6, to: 4, id: 3 },
  { from: 4, to: 2, id: 4 },
  { from: 1, to: 3, id: 5 },
  { from: 5, to: 2, id: 10 },
  { from: 7, to: 2, id: 13 },
  { from: 8, to: 2, id: 15 },
  { from: 2, to: 3, id: 16 },
  { from: 2, to: 6, id: 17 },
  { from: 1, to: 4, id: 18 },
];

const options: Options = {
  width: '100%',
  height: '100%',
  edges: {
    color: '#210d41',
    smooth: {
      enabled: true,
      type: 'continuous',
      roundness: 0,
    },
    arrows: {
      to: { enabled: false },
      from: { enabled: false },
      middle: { enabled: false },
    },
  },
  nodes: {
    shape: 'dot',
    size: 32,
  },
  interaction: {
    hover: true,
  },
  layout: {
    hierarchical: {
      enabled: false,
      nodeSpacing: 100,
    },
  },
};

// function getSizeOfNode(maxSize: number, sizeOfDocsOfNode: number) {
//   console.log('maxSize', maxSize, 'sizeOfDocsOfNode', sizeOfDocsOfNode);
//   const originalSizeOfNode = (sizeOfDocsOfNode / maxSize) * 100;
//   const minValue = 60;
//   const maxValue = 100;
//   const totalDifference = maxValue - minValue;
//   const scaleFactor = originalSizeOfNode / maxValue;
//   const adjustedValue = scaleFactor * totalDifference + minValue;
//   console.log('adjustedValue', adjustedValue);
//   return adjustedValue;
// }

function VisGraph() {
  const router = useRouter();
  const [graph, setGraph] = useState({ nodes, edges });
  const [indexesStats, setIndexesStats] = useState<IndexStat[]>([]);
  const { t } = useTranslation('common');
  const numberFormat = new Intl.NumberFormat('pt-BR');

  const events = {
    click: function (event: any) {
      console.log('event.nodes', nodes[event.nodes[0] - 1].indexText);
      if (event.nodes[0]) {
        const index = nodes[event.nodes[0] - 1].indexText;
        router.push({
          pathname: '/search',
          query: { index: index },
        });
      }
    },
  };

  useEffect(() => {
    ElasticSearchStatsService()
      .then((res) => {
        setIndexesStats(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    const newNodes: IndexNode[] = [];
    // const maxSizeOfNode = Math.max(...indexesStats.map((item) => item['docs.count']));
    for (let i = 0; i < nodes.length; i++) {
      const indexStat = indexesStats.find((item) => item.index === nodes[i].index);
      if (indexStat) {
        localStorage.setItem(nodes[i].index, `${indexStat['docs.count']}`);
        nodes[i].title = `${numberFormat.format(indexStat['docs.count'])} `;
        // nodes[i].widthConstraint = getSizeOfNode(maxSizeOfNode, indexStat['docs.count']);
      }
      // @ts-ignore
      nodes[i].label = t(nodes[i].indexText);
      // @ts-ignore
      if (!nodes[i].title?.includes(nodes[i].label)) {
        // @ts-ignore
        nodes[i].title += nodes[i].label;
      }
      newNodes.push({ ...nodes[i] });
    }

    setGraph({ ...graph, nodes: newNodes });
  }, [t, indexesStats]);

  return (
    <div className="graph">
      {/**
             // @ts-ignore */}
      <Graph graph={graph} options={options} events={events} />
    </div>
  );
}

export default VisGraph;
