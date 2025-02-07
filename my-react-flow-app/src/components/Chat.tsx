import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";

interface ChatMessage {
  question: string;
  answer: string;
}

interface ChatProps {
  data: {
    onSend: (prompt: string) => void;
    chatHistory: ChatMessage[];
  };
}

const Chat: React.FC<{ data: ChatProps["data"] }> = ({ data }) => {
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    if (prompt.trim()) {
      data.onSend(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="border border-green-500 p-4 w-96 rounded bg-white shadow-lg">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />

      <h3 className="font-bold mb-3 text-center">Chat</h3>

      <div className="border border-gray-300 mb-3 p-2 h-52 overflow-y-auto rounded">
        {data.chatHistory.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <p>
              <strong>Question:</strong> {msg.question}
            </p>
            <p>
              <strong>Answer:</strong> {msg.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your question…"
          className="flex-grow border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default Chat;
