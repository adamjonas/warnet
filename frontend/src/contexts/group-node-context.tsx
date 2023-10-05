import React, { useEffect, useRef, useState } from "react";
import {useNodeFlowContext} from "./node-flow-context"
import {
  GroupedNodeContext,
  NodeGraphContext,
  SavedNetworkGraph,
} from "@/flowTypes";
import useGroupedNodes from "@/hooks/useGroupedNodes";

export const groupedNodeContext = React.createContext<GroupedNodeContext>(null!);

export const GroupedNodeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  
  const {nodes, edges} = useNodeFlowContext()
  const { groupedNodes, groupedNodeInfo, selectGroupedNode} = useGroupedNodes({nodes})
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const editGroupedNode = () => {}
  const saveEditedGroupNode = () => {}
  const addGroupNode = () => {}
  const deleteGroupNode = () => {}

  return (
    <groupedNodeContext.Provider
      value={{
        groupedNodes,
        groupedNodeInfo,
        selectGroupedNode,
        isDialogOpen,
        editGroupedNode,
        saveEditedGroupNode,
        openDialog,
        closeDialog,
        addGroupNode,
        deleteGroupNode,
      }}
    >
      {children}
    </groupedNodeContext.Provider>
  );
};

export const useGroupedNodeContext = () => {
  const context = React.useContext(groupedNodeContext);
  if (context === undefined) {
    throw new Error(
      "useGroupedNodeContext must be used within a GroupedNodeProvider"
    );
  }
  return context;
};
