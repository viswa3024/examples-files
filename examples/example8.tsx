"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [latestBotResponse, setLatestBotResponse] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // ✅ Ref for chat container
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // ✅ Auto scroll when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        session_id: sessionId,
        message: input,
      });

      const data = res.data;
      setSessionId(data.session_id);

      // Append bot message + prompt
      const botMsg = data.response;
      setMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);

      // Save for potential dashboard visualization
      setLatestBotResponse(botMsg);

      // Reset input
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleYesForDashboard = async () => {
    if (!latestBotResponse) return;

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        session_id: sessionId,
        message: "dashboard",
      });

      const data = res.data;
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      setShowDashboard(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 flex flex-col space-y-4">
        {/* ✅ Scrollable message container */}
        <div
          ref={chatContainerRef}
          className="h-[60vh] overflow-y-auto space-y-4 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl ${
                msg.sender === "user"
                  ? "bg-blue-100 self-end text-right"
                  : "bg-gray-100 self-start"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>

              {/* Ask for dashboard */}
              {msg.sender === "bot" &&
                idx === messages.length - 1 &&
                !showDashboard && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      Would you like a dashboard to visualize?
                    </p>
                    <button
                      onClick={handleYesForDashboard}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Yes
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Input field */}
        <div className="flex space-x-3">
          <input
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
