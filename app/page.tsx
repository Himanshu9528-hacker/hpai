"use client";

import { useState, useRef, useEffect } from "react";
import { FiMic, FiImage, FiFile, FiTrash2, FiArrowDown } from "react-icons/fi";

export default function Home() {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  function newChat() {
    const id = chats.length + 1;
    const chat = { title: "Chat " + id, messages: [] };
    setChats([...chats, chat]);
    setCurrentChat(chats.length);
  }

  function clearChat() {
    if (currentChat === null) return;
    const updated = [...chats];
    updated[currentChat].messages = [];
    setChats(updated);
  }

  async function sendMessage() {
    if (!input.trim() || currentChat === null) return;

    const updatedChats = [...chats];

    updatedChats[currentChat].messages.push({
      role: "user",
      content: input,
    });

    const sendText = input;
    setChats(updatedChats);
    setInput("");

    setIsTyping(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: sendText }),
    });

    const data = await res.json();
    setIsTyping(false);

    updatedChats[currentChat].messages.push({
      role: "assistant",
      content: data.reply,
    });

    setChats([...updatedChats]);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isTyping]);

  return (
    <div className="flex h-screen bg-[#0a0f1f] text-white overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 p-4 bg-white/10 backdrop-blur-lg border-r border-white/10">
        <button
          onClick={newChat}
          className="w-full py-2 mb-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
        >
          New Chat
        </button>

        <div className="space-y-2 overflow-y-auto h-[85vh] pr-2">
          {chats.map((chat, i) => (
            <div
              key={i}
              onClick={() => setCurrentChat(i)}
              className="p-3 rounded-xl cursor-pointer bg-white/5 hover:bg-white/20 transition"
            >
              {chat.title}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CHAT */}
      <main className="flex-1 flex flex-col p-6 relative">

        <h1 className="text-3xl font-bold text-blue-400 mb-4 tracking-wide">
          HP AI
        </h1>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {currentChat !== null &&
            chats[currentChat]?.messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600/80 ml-auto"
                    : "bg-white/10 border border-white/10 backdrop-blur-xl"
                }`}
              >
                {msg.content}
              </div>
            ))}

          {/* Typing Animation */}
          {isTyping && (
            <div className="max-w-[70%] p-3 rounded-2xl text-sm bg-white/10 border border-white/10 backdrop-blur-xl flex gap-2">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Bar */}
        <div className="flex mt-4 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
          <input
            className="flex-1 bg-transparent outline-none px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type…"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition"
          >
            Send
          </button>
        </div>

        {/* Floating Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <button className="p-4 bg-blue-600/80 rounded-full"><FiMic size={18} /></button>
          <button className="p-4 bg-blue-600/80 rounded-full"><FiImage size={18} /></button>
          <button className="p-4 bg-blue-600/80 rounded-full"><FiFile size={18} /></button>
          <button onClick={clearChat} className="p-4 bg-red-600/80 rounded-full"><FiTrash2 size={18} /></button>
          <button onClick={() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" })} className="p-4 bg-white/20 rounded-full"><FiArrowDown size={18} /></button>
        </div>
      </main>
    </div>
  );
}
