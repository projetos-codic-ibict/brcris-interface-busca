import React, { useEffect } from "react";
import { Options, Edge, Node } from "vis-network/standalone/esm/vis-network";

import useVisNetwork from "../services/useVisNetwork";

const nodes: Node[] = [
  {
    id: 1,
    label: "Publicações",
    title: "Publicações",
    level: 1,
    group: "struct",
    color: "#F7964D",
  },
  {
    id: 2,
    label: "Pessoas",
    title: "Pessoas",
    level: 2,
    group: "struct",
    color: "#4152B3",
  },
  {
    id: 3,
    label: "Instituições",
    title: "Instituições",
    level: 3,
    group: "struct",
    color: "#008037",
  },
  {
    id: 4,
    label: "Revistas",
    title: "Revistas",
    level: 4,
    group: "struct",
    color: "#FF5757",
  },
  {
    id: 5,
    label: "Autores",
    title: "Autores",
    level: 5,
    group: "struct",
    color: "#FFDE59",
  },
  {
    id: 6,
    label: "Fundações",
    title: "Fundações",
    level: 6,
    group: "struct",
    color: "#CB6CE6",
  },
  {
    id: 7,
    label: "UESPI",
    title: "UESPI",
    level: 7,
    group: "struct",
    color: "#4152B3",
  },
  {
    id: 8,
    label: "IFMA",
    title: "IFMA",
    level: 8,
    group: "struct",
    color: "#00dafc",
  },
  {
    id: 9,
    label: "UFPE",
    title: "UFPE",
    level: 9,
    group: "struct",
    color: "#fff",
  },
];

const edges: Edge[] = [
  { from: 1, to: 2, id: 1 },
  { from: 1, to: 3, id: 3 },
  { from: 2, to: 3, id: 2 },
  { from: 1, to: 4, id: 4 },
  { from: 5, to: 6, id: 6 },
  { from: 1, to: 6, id: 5 },
  { from: 6, to: 2, id: 7 },
  { from: 1, to: 5, id: 8 },

  { from: 7, to: 8, id: 9 },
  { from: 1, to: 7, id: 10 },
  { from: 1, to: 9, id: 11 },
  { from: 1, to: 8, id: 12 },
  { from: 4, to: 7, id: 13 },
  { from: 6, to: 8, id: 14 },
];

const options: Options = {
  groups: {
    market: {
      shape: "triangleDown"
    },
    struct: {
      shape: "circle"
    }
  },
  interaction: {
    selectable: true,
    selectConnectedEdges: true
  },
  edges: {
    smooth: {
      enabled: true,
      type: "continuous",
      roundness: 0
    }
  },
  nodes: {
    shape: "dot",
    size: 64
  },
  layout: {
    hierarchical: {
      enabled: false
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

    // network.focus(5);
  };

  useEffect(() => {
    if (!network) return;

    network.once("beforeDrawing", () => {
      // network.focus(5);
    });
    network.setSelection({
      edges: [1, 2, 3],
      nodes: [1, 2, 3]
    });
  }, [network]);

  return (
    <>
      {/* <button onClick={handleClick}>Focus</button> */}
      <div style={{ height: "50vh", width: "50vh" }} ref={ref} />
    </>
  );
};
