import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  useEdgesState,
  useNodesState,
  Controls,
  Background,
  Connection,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  getOrganizations,
  getChatAnswer,
  Organization as Org,
  OrganizationsResponse,
  ChatResponse,
} from "./Logic";

import Chat from "./Chat";
import Organization from "./Organization";
interface ChatMessage {
  question: string;
  answer: string;
}
const nodeTypes = {
  chatNode: Chat,
  orgNode: Organization,
};

function Section() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedOrgIds, setSelectedOrgIds] = useState<string[]>([]);
  const handleSelectOrg = (orgId: string) => {
    setSelectedOrgIds((prev) => {
      if (prev.includes(orgId)) {
        return prev.filter((id) => id !== orgId);
      }
      return [...prev, orgId];
    });
  };

  const handleSendChat = useCallback(
    async (prompt: string) => {
      const chatResponse: ChatResponse = await getChatAnswer(
        selectedOrgIds,
        prompt
      );
      setChatHistory((prev) => [
        ...prev,
        { question: chatResponse.question, answer: chatResponse.answer },
      ]);
    },
    [selectedOrgIds]
  );

  useEffect(() => {
    async function loadData() {
      const orgResponse: OrganizationsResponse = await getOrganizations();
      if (!orgResponse?.content?.length) return;

      const chatNode = {
        id: "chat-node",
        type: "chatNode",
        position: { x: 20, y: 180 },
        data: {
          question: "",
          chatHistory,
          onSend: handleSendChat,
        },
      };

      const parent = orgResponse.content[0];
      const parentNode = {
        id: parent.id,
        type: "orgNode",
        position: { x: 500, y: 320 },
        data: {
          orgData: parent,
          onSelect: handleSelectOrg,
          isSelected: selectedOrgIds.includes(parent.id),
        },
      };

      const childNodes = (parent.children || []).map((child: Org, index) => {
        return {
          id: child.id,
          type: "orgNode",
          position: { x: 900, y: 200 + index * 130 },
          data: {
            orgData: child,
            onSelect: handleSelectOrg,
            isSelected: selectedOrgIds.includes(child.id),
          },
        };
      });

      const edgeChatToParent = {
        id: "edge-chat-parent",
        source: "chat-node",
        target: parent.id,
      };

      const edgesParentToChildren = (parent.children || []).map(
        (child: Org) => {
          return {
            id: `edge-${parent.id}-${child.id}`,
            source: parent.id,
            target: child.id,
          };
        }
      );

      const allNodes = [chatNode, parentNode, ...childNodes];
      const allEdges = [edgeChatToParent, ...edgesParentToChildren];

      setNodes(allNodes);
      setEdges(allEdges);
    }

    loadData();
  }, [chatHistory, handleSendChat, selectedOrgIds, setEdges, setNodes]);

  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === "chat-node") {
          return {
            ...node,
            data: {
              ...node.data,
              chatHistory: chatHistory,
            },
          };
        }
        return node;
      })
    );
  }, [chatHistory, setNodes]);

  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.type === "orgNode") {
          const orgId = node.data.orgData.id;
          return {
            ...node,
            data: {
              ...node.data,
              isSelected: selectedOrgIds.includes(orgId),
              selectedOrgIds,
            },
          };
        }
        return node;
      })
    );
  }, [selectedOrgIds, setNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "80vw", height: "100vh" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default Section;
