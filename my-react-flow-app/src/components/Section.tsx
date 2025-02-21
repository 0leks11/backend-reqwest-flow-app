// Comments in English, each line up to 80 chars

import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  useEdgesState,
  useNodesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  Organization,
  OrganizationsResponse,
  getOrganizations,
  getChatAnswer,
} from "./Logic";
import Chat from "./Chat";
import OrganizationNode from "./Organization";

interface ChatMessage {
  question: string;
  answer: string;
}

const nodeTypes = {
  chatNode: Chat,
  orgNode: OrganizationNode,
};

export default function Section() {
  // Список всех организаций (иерархия)
  // const [allOrgs, setAllOrgs] = useState<Organization[]>([]);

  // Какие организации пользователь «выбрал» (для логики запроса)
  const [selectedOrgIds, setSelectedOrgIds] = useState<string[]>([]);

  // Список «релевантных» (подсвеченных) организаций,
  // который приходит после ответа чата.
  const [relevantOrgIds, setRelevantOrgIds] = useState<string[]>([]);

  // Исходная сборка всех нод/эджей (вся структура)
  // Мы делаем это один раз, а потом лишь обновляем data
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Рекурсивная функция для «единовременной» сборки всех нод
  const buildTree = useCallback(
    (
      org: Organization,
      parentId: string | null,
      x: number,
      y: number,
      nodesAcc: Node[],
      edgesAcc: Edge[]
    ) => {
      const nodeId = org.id;

      // Создаём узел (пока без логики «релевантности»,
      //   она будет в data обновляться позже)
      nodesAcc.push({
        id: nodeId,
        type: "orgNode",
        position: { x, y },
        data: {
          orgData: org,
          // При первой сборке мы не знаем, релевантен ли
          // (пусть по умолчанию true).
          isRelevant: true,
          // Логика выбора пользователем (подсветка)
          isSelected: false,
          onSelect: (clickedId: string) => {
            setSelectedOrgIds((prev) => {
              if (prev.includes(clickedId)) {
                return prev.filter((id) => id !== clickedId);
              } else {
                return [...prev, clickedId];
              }
            });
          },
        },
      });

      if (parentId) {
        edgesAcc.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
        });
      }

      if (org.children && org.children.length > 0) {
        let localY = y;
        for (let i = 0; i < org.children.length; i++) {
          localY += 120; // смещаем вниз
          buildTree(
            org.children[i],
            nodeId,
            x + 300,
            localY,
            nodesAcc,
            edgesAcc
          );
        }
      }
    },
    []
  );

  // Запрос в чат
  const handleSendChat = useCallback(
    async (prompt: string) => {
      // Если пользователь не выбрал ни одной, передаём пустой массив
      // (бэкенд/мок трактует это как "все")
      const chatResponse = await getChatAnswer(selectedOrgIds, prompt);

      // Возвращённые ID релевантных организаций
      const relevant = chatResponse.documents.map((doc) => doc.id);

      // Сохраняем их в стейт
      setRelevantOrgIds(relevant);

      // Обновляем историю
      setChatHistory((prev) => [
        ...prev,
        { question: chatResponse.question, answer: chatResponse.answer },
      ]);
    },
    [selectedOrgIds]
  );

  // Загружаем и строим всё дерево **только один раз**
  // (или когда меняется список орг?)
  useEffect(() => {
    (async () => {
      const resp: OrganizationsResponse = await getOrganizations();
      const content = resp.content || [];
      // setAllOrgs(content);

      // Собираем ВСЕ узлы (и связи) рекурсивно
      const tempNodes: Node[] = [];
      const tempEdges: Edge[] = [];

      let baseY = 200;
      for (let i = 0; i < content.length; i++) {
        buildTree(content[i], null, 300, baseY, tempNodes, tempEdges);
        baseY += 300;
      }

      // Добавим чат-ноду
      const chatNodeId = "chat-node";
      tempNodes.push({
        id: chatNodeId,
        type: "chatNode",
        position: { x: 20, y: 400 },
        data: {
          question: "",
          chatHistory: [],
          onSend: handleSendChat,
        },
      });
      if (content.length > 0) {
        tempEdges.push({
          id: `edge-chat-${content[0].id}`,
          source: chatNodeId,
          target: content[0].id,
        });
      }

      setNodes(tempNodes);
      setEdges(tempEdges);
    })();
  }, [buildTree, handleSendChat]);

  // Теперь, когда меняются `relevantOrgIds`, обновляем поле data.isRelevant
  // внутри каждого узла.
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === "chat-node") {
          // Обновим chatHistory, если оно изменилось
          return {
            ...node,
            data: {
              ...node.data,
              chatHistory: chatHistory,
            },
          };
        }

        // Для остальных нод (orgNode)
        // Если relevantOrgIds пуст - считаем, что все релевантны
        const isAllRelevant = relevantOrgIds.length === 0;
        const isRelevant = isAllRelevant || relevantOrgIds.includes(node.id);

        return {
          ...node,
          data: {
            ...node.data,
            isRelevant,
          },
        };
      })
    );
  }, [relevantOrgIds, chatHistory, setNodes]);

  // Также, если пользователь выбирает/снимает выбор (selectedOrgIds),
  //   можно подсвечивать это. Но это уже отдельная логика:
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === "chat-node") {
          return node;
        }
        // Если выбран - isSelected = true
        const isSelected = selectedOrgIds.includes(node.id);
        return {
          ...node,
          data: {
            ...node.data,
            isSelected,
          },
        };
      })
    );
  }, [selectedOrgIds, setNodes]);

  // Возможность соединять вручную (если нужно)
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
