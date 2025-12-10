"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome to HP AI! How can I assist you today?" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Step 1: Add user message
    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");

    // Step 2: Call backend API
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    });

    const data = await res.json();

    // Step 3: Add bot reply
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: data.reply },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-center">HP AI</h1>

      <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-zinc-900 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-sm ${
              msg.from === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-zinc-700 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex mt-4">
        <input
          className="flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="ml-3 px-5 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
