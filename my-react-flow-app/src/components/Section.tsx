import React, { useEffect, useState } from "react";
import {
  getOrganizations,
  getChatAnswer,
  Organization as Org,
  OrganizationsResponse,
  ChatResponse,
} from "./Logic";

import Organization from "./Organization";
import Chat from "./Chat";

interface ChatMessage {
  question: string;
  answer: string;
}

const Section: React.FC = () => {
  const [organizations, setOrganizations] = useState<Org[]>([]);
  const [selectedOrgIds, setSelectedOrgIds] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response: OrganizationsResponse = await getOrganizations();
      if (response && response.content) {
        const allOrgs: Org[] = [];

        response.content.forEach((parentOrg: Org) => {
          allOrgs.push({
            id: parentOrg.id,
            name: parentOrg.name,
          });
          if (parentOrg.children && parentOrg.children.length) {
            parentOrg.children.forEach((child: Org) => {
              allOrgs.push(child);
            });
          }
        });

        setOrganizations(allOrgs);
      }
    }
    fetchData();
  }, []);

  const handleSelectOrg = (orgId: string) => {
    setSelectedOrgIds((prev) => {
      if (!prev.includes(orgId)) {
        return [...prev, orgId];
      } else {
        return prev.filter((id) => id !== orgId);
      }
    });
  };

  const handleSendChat = async (promptText: string) => {
    const chatResponse: ChatResponse = await getChatAnswer(
      selectedOrgIds,
      promptText
    );
    setChatHistory((prev) => [
      ...prev,
      {
        question: chatResponse.question,
        answer: chatResponse.answer,
      },
    ]);
  };

  return (
    <div className="flex gap-4 p-4">
      <div className="w-72">
        <h2 className="font-bold text-xl mb-2">List of Organizations</h2>
        {organizations.map((org) => (
          <Organization key={org.id} orgData={org} onSelect={handleSelectOrg} />
        ))}

        <p className="mt-2">
          <strong>Selected organizations:</strong> {selectedOrgIds.join(", ")}
        </p>
      </div>

      <Chat onSend={handleSendChat} chatHistory={chatHistory} />
    </div>
  );
};

export default Section;
