"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "bot"; content: string }[]
  >([]);
  const [dashboardData, setDashboardData] = useState<string | null>(null); // store latest dashboard

  const DASHBOARD_API = "http://localhost:8000/dashboard"; // endpoint to generate dashboard

  const handleSend = async () => {
    if (!query.trim()) return;

    // Append user message
    setChatHistory((prev) => [...prev, { role: "user", content: query }]);

    // Check if user wants to visualize latest response
    const lastBot = chatHistory
      .slice()
      .reverse()
      .find((m) => m.role === "bot");

    if (lastBot && query.toLowerCase() === "yes") {
      // Send last bot response to dashboard API
      try {
        const res = await fetch(DASHBOARD_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markdown: lastBot.content }),
        });
        const data = await res.json();

        setDashboardData(data.dashboard_markdown || "⚠️ Failed to generate dashboard");
      } catch (err) {
        console.error(err);
        setDashboardData("⚠️ Dashboard API error");
      }

      setQuery("");
      return;
    }

    // Send normal user query to chat API
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          session_id: sessionId,
        }),
      });

      const data = await res.json();

      if (!sessionId) setSessionId(data.session_id);

      // Append bot response + dashboard prompt
      const botMessage = data.response + "\n\nWould you like a dashboard to visualize?";

      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: botMessage },
      ]);

      setQuery("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Chat Column */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto border p-4 rounded-lg mb-4 space-y-2">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.role === "bot" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border p-2 rounded-lg"
            placeholder="Enter your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-lg"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>

      {/* Dashboard Column */}
      <div className="w-1/2 border p-4 rounded-lg overflow-y-auto">
        {dashboardData ? (
          <ReactMarkdown>{dashboardData}</ReactMarkdown>
        ) : (
          <p className="text-gray-400">Dashboard will appear here</p>
        )}
      </div>
    </div>
  );
}
