import React, { useEffect } from "react";
import { Options, Edge, Node } from "vis-network";

import useVisNetwork from "./useVisNetwork";

const nodes: Node[] = [
  {
    id: 1,
    label: "test",
    title: "ПАО Т Плюс",
    // level: 1,
    group: "struct"
  },
  {
    id: 2,
    label: "Филиал",
    title: "Пермский филиал",
    // level: 2,
    group: "struct"
  },
  {
    id: 3,
    label: "Станция",
    title: "Пермская ТЭЦ-6",
    // level: 3,
    group: "object"
  },
  {
    id: 4,
    label: "РГЕ",
    title: "Пермская ТЭЦ-6",
    // level: 4,
    group: "market"
  },
  {
    id: 5,
    label: "Турбина",
    title: "ГТУ-7",
    // level: 5,
    group: "object"
  },
  {
    id: 6,
    label: "ГТПГ",
    // level: 4,
    group: "market"
  },
  {
    id: 7,
    label: "test",
    // level: 3,
    group: "object"
  }
];

const edges: Edge[] = [
  { from: 1, to: 2, id: 1 },
  { from: 1, to: 3, id: 6 },
  { from: 2, to: 3, id: 2 },
  { from: 3, to: 5, id: 3 },
  { from: 3, to: 4, id: 4 },
  { from: 4, to: 5, id: 5 },
  { from: 3, to: 6, id: 7 },
  { from: 1, to: 7, id: 8 },
  { from: 1, to: 7, id: 10 },
  { from: 2, to: 7, id: 9 }
];

const options: Options = {
  groups: {
    market: {
      shape: "triangleDown"
    },
    struct: {
      shape: "hexagon"
    }
  },
  interaction: {
    selectable: false,
    selectConnectedEdges: false
  },
  edges: {
    smooth: {
      enabled: true,
      type: "diagonalCross",
      roundness: 0.5
    }
  },
  nodes: {
    shape: "dot",
    size: 16
  },
  layout: {
    hierarchical: {
      enabled: true
    }
  }
};

export default () => {
  const { ref, network } = useVisNetwork({
    options,
    edges,
    nodes
  });

  const handleClick = () => {
    if (!network) return;

    network.focus(5);
  };

  useEffect(() => {
    if (!network) return;

    network.once("beforeDrawing", () => {
      network.focus(5);
    });
    network.setSelection({
      edges: [1, 2, 3, 4, 5],
      nodes: [1, 2, 3, 4, 5]
    });
  }, [network]);

  return (
    <>
      <button onClick={handleClick}>Focus</button>
      <div style={{ height: 700, width: "100%" }} ref={ref} />
    </>
  );
};
