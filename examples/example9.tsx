"use client";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [dashboardMarkdown, setDashboardMarkdown] = useState("");
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const dashboardKeywords = ["visualize", "dashboard", "chart", "show me", "display"];
  const affirmative = ["yes", "sure", "yup", "ok", "please"];

  const sendMessage = async () => {
    if (!input) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);

    let botResponse = "";

    if (awaitingConfirmation && affirmative.includes(input.toLowerCase())) {
      // Example markdown dashboard
      botResponse = ``;
      
      // Extract first line as title (name of dashboard)
      const lines = botResponse.trim().split("\n");
      const title = lines[0].replace(/^#+\s*/, ""); // remove markdown ## or # symbols
      const contentWithoutTitle = lines.slice(1).join("\n").trim();

      setDashboardTitle(title);
      setDashboardMarkdown(contentWithoutTitle);
      setAwaitingConfirmation(false);
    } 
    else if (dashboardKeywords.some(k => input.toLowerCase().includes(k))) {
      botResponse = "Do you want to visualize this as a dashboard? (yes/no)";
      setAwaitingConfirmation(true);
    } 
    else {
      botResponse = "Bot reply to: " + input;
    }

    setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
    setInput("");
  };

  const saveDashboard = async () => {
    if (!dashboardMarkdown) return;

    const name = dashboardTitle || "Untitled Dashboard";

    await axios.post("http://localhost:8000/dashboards", {
      name,
      markdown_content: dashboardMarkdown,
    });

    alert(`Dashboard "${name}" saved!`);
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <div className="flex-1 overflow-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <p className={`inline-block px-3 py-1 my-1 rounded ${m.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
              {m.text}
            </p>
          </div>
        ))}

        {/* Show dashboard markdown (without first line) */}
        {dashboardMarkdown && (
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <ReactMarkdown>{dashboardMarkdown}</ReactMarkdown>
            <button
              onClick={saveDashboard}
              className="mt-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Dashboard
            </button>
          </div>
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}
