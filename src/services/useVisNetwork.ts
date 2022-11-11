/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useLayoutEffect, useRef } from 'react'
import { Network, Options, Data, Edge, Node } from 'vis-network'

export interface UseVisNetworkOptions {
  options: Options
  nodes: Node[]
  edges: Edge[]
}

export default function VisNetwork(props: UseVisNetworkOptions) {
  const { edges, nodes, options } = props

  const [network, addNetwork] = useState<Network | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const data: Data = { nodes, edges }

  useLayoutEffect(() => {
    if (ref.current) {
      const instance = new Network(ref.current, data, options)
      addNetwork(instance)
    }
    return () => network?.destroy()
  }, [])

  return {
    network,
    ref,
  }
}
