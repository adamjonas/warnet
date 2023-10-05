import React, { useEffect, useRef, useState } from "react";
import {
  Pencil1Icon,
  TrashIcon,
  CopyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { useNodeFlowContext } from "@/contexts/node-flow-context";
import { Node } from "reactflow";
import { GraphNode } from "@/flowTypes";
import { isInViewport } from "@/helpers/client-inferences";
import { useGroupedNodeContext } from "@/contexts/group-node-context";
import { GroupedNodeType } from "@/helpers/build-grouped-node-type";

const NodeList = () => {
  const { nodes, editNode, deleteNode, duplicateNode, nodeInfo, selectNode } =
    useNodeFlowContext();
  const { groupedNodes, groupedNodeInfo, selectGroupedNode } =
    useGroupedNodeContext();

  const handleEditNode = (node: Node<GraphNode>) => {
    editNode(node);
  };

  const [isDropdownOpenHash, setIsDropdownOpenHash] = useState<string | null>(
    null
  );

  const handleDropdownToggle = (hash: string) => {
    setIsDropdownOpenHash((prev) => {
      if (prev === hash) return null;
      return hash;
    });
  };

  const GroupNode = ({
    nodeType,
    idx,
  }: {
    nodeType: GroupedNodeType;
    idx: number;
  }) => {
    const isSelected = nodeType.hash === groupedNodeInfo?.hash;
    const isDropdownOpen = nodeType.hash === isDropdownOpenHash;
    const handleNodeTypeClick = () => {
      if (isSelected) return;
      selectGroupedNode(idx);
    };
    return (
      <div>
        <div
          onClick={handleNodeTypeClick}
          // ref={nodeRef}
          data-nodetype-highlight={isSelected || null}
          className="group data-[nodetype-highlight]:bg-brand-gray-medium data-[nodetype-highlight]:text-white w-full text-xl flex justify-between items-center gap-2 px-4 py-4 border-b-[1px] border-brand-gray-medium"
        >
          <div className="flex h-full items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-300"></span>
            <p className="pointer-events-none">
              {nodeType.name ?? nodeType.hash.slice(0, 6)}
            </p>
          </div>
          <div className="flex gap-2 text-black">
            <button
              // onClick={() => handleEditNode(node)}
              className="p-1 hover:text-brand-gray-light text-white"
            >
              <Pencil1Icon />
            </button>
            <button
              // onClick={() => deleteNode(node)}
              className="p-1 hover:text-brand-gray-light text-white"
            >
              <TrashIcon />
            </button>
            <button
              onClick={() => handleDropdownToggle(nodeType.hash)}
              className="p-1 hover:text-brand-gray-light text-white"
            >
              {isDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
          </div>
        </div>
        <div
          className={
            !isDropdownOpen
              ? ""
              : "border-b-[2px] border-x-[2px] border-brand-gray-medium bg-brand-gray-dark overflow-clip"
          }
        >
          {isDropdownOpen &&
            nodeType.children.map((id) => {
              const node = nodes.find((node) => node.id === id);
              if (!node) return null;
              return (
                <SingleNode key={id} node={node} isGroupSelected={isSelected} />
              );
            })}
        </div>
      </div>
    );
  };

  const SingleNode = ({
    node,
    isGroupSelected,
  }: {
    node: Node<GraphNode>;
    isGroupSelected: boolean;
  }) => {
    const isSelected = nodeInfo?.id === node.id;
    const handleNodeClick = () => {
      if (isSelected) return;
      selectNode(node.id);
    };
    useEffect(() => {
      if (nodeRef.current && isSelected) {
        const nodeInViewport = isInViewport(nodeRef.current);
        if (nodeInViewport) return;
        nodeRef.current.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "nearest",
        });
      }
    }, [isSelected]);
    const nodeRef = useRef<HTMLDivElement>(null);

    return (
      <div
        onClick={handleNodeClick}
        ref={nodeRef}
        data-node-highlight={isSelected || null}
        // data-nodetype-highlight={isGroupSelected}
        className="group data-[nodetype-highlight]: data-[node-highlight]:bg-brand-gray-medium data-[node-highlight]:text-white w-full text-xl flex justify-between items-center gap-2 px-4 py-4 border-b-[1px] border-brand-gray-medium"
      >
        <div className="flex h-full items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-300"></span>
          <p>{node?.data?.label}</p>
        </div>
        <div className="flex gap-2 text-black">
          <button
            onClick={() => duplicateNode(node)}
            className="p-1 hover:text-brand-gray-light text-white"
          >
            <CopyIcon className="" />
          </button>
          <button
            onClick={() => handleEditNode(node)}
            className="p-1 hover:text-brand-gray-light text-white"
          >
            <Pencil1Icon />
          </button>
          <button
            onClick={() => deleteNode(node)}
            className="p-1 hover:text-brand-gray-light text-white"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-scroll flex flex-col">
      {/* {nodes.map(node => <SingleNode key={node.id} node={node}/>)} */}
      {groupedNodes.map((nodeType, idx) => (
        <GroupNode key={nodeType.hash} nodeType={nodeType} idx={idx} />
      ))}
    </div>
  );
};

export default NodeList;
