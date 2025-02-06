import React, { useState } from "react";

interface ChatMessage {
  question: string;
  answer: string;
}

interface ChatProps {
  onSend: (prompt: string) => void;
  chatHistory: ChatMessage[];
}

const Chat: React.FC<ChatProps> = ({ onSend, chatHistory }) => {
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    if (prompt.trim()) {
      onSend(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="border border-green-500 p-4 w-96 rounded">
      <h3 className="font-bold mb-3">Чат</h3>

      <div className="border border-gray-300 mb-3 p-2 h-52 overflow-y-auto rounded">
        {chatHistory.map((msg, idx) => (
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
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;
