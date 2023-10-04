import { GraphNode } from "@/flowTypes";

import { createHash } from "crypto";
import { Node } from "reactflow";

export type GroupedNodeType = {
  name?: string;
  hash: string;
  children: GraphNode["id"][];
  data: ComputeHashProps
}

type ComputeHashProps = Pick<GraphNode, "version" | "latency" | "ram" | "cpu" >

export const computeHash = (data: any) => {
  const stringData = JSON.stringify(data)
  const hash = createHash("sha256").update(stringData).digest("hex")
  return hash
}

export const computedHash = (nodes: Node<GraphNode, string | undefined>[]) => {
  let index = 0
  const mappedHashToIndex: Record<string, number> = {}
  // const uniqueHash = new Set()
  const computedList: GroupedNodeType[] = []
  for(const node of nodes) {
    const {version, latency, ram, cpu} = node.data
    const hash = computeHash({
      version: version ?? "",
      latency: latency ?? "",
      ram: ram?.toString() ?? "",
      cpu: cpu?.toString() ?? "",
    })
    if (mappedHashToIndex[hash] !== undefined) {
      computedList[mappedHashToIndex[hash]].children.push(node.id)
    } else {
      mappedHashToIndex[hash] = index
      computedList[index] = {
        hash,
        children: [node.id],
        data: {version, latency, ram, cpu}
      }
      index++
    }
  }
  return computedList
}
