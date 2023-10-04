import { GraphNode } from '@/flowTypes'
import { GroupedNodeType, computeHash, computedHash } from '@/helpers/build-grouped-node-type'
import { createHash } from 'crypto'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Node } from 'reactflow'

const useGroupedNodes = ({nodes}: {nodes: Node<GraphNode, string | undefined>[]}) => {
  const [groupedNodes, setGroupedNodes] = useState<GroupedNodeType[] | null>(null);
  const [groupedNodeInfo, setGroupedNodeInfo] = useState<GroupedNodeType | null>(null);
  const count = useRef(0)
  
  const memoNodeListHash = useMemo(() => {
    const hash = computeHash(nodes)
    return hash
  }, [nodes])

  useEffect(() => {
    const groupedNodes = computedHash(nodes)
    setGroupedNodes(groupedNodes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoNodeListHash])

  const selectGroupedNode = (idx: number) => {
    if (groupedNodes?.[idx]) {
      setGroupedNodeInfo(groupedNodes[idx])
    }
  }
  
  return {groupedNodes, groupedNodeInfo, selectGroupedNode}
}

export default useGroupedNodes