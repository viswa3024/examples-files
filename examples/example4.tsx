"use client";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [dashboardMarkdown, setDashboardMarkdown] = useState("");
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const dashboardKeywords = ["visualize", "dashboard", "chart", "show me", "display"];
  const affirmative = ["yes", "sure", "yup", "ok", "please"];

  const sendMessage = async () => {
    if (!input) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);

    let botResponse = "";

    // 1. Check if waiting for confirmation
    if (awaitingConfirmation && affirmative.includes(input.toLowerCase())) {
      botResponse = "Here is your dashboard in markdown:\n\n```markdown\n## Sales Chart\n- Revenue: $100k\n- Profit: $20k\n```";
      setDashboardMarkdown(botResponse);
      setAwaitingConfirmation(false);
    }
    // 2. Check if input contains dashboard keywords
    else if (dashboardKeywords.some(k => input.toLowerCase().includes(k))) {
      botResponse = "Do you want to visualize this as a dashboard? (yes/no)";
      setAwaitingConfirmation(true);
    }
    // 3. Default bot reply
    else {
      botResponse = "Bot reply to: " + input;
    }

    setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
    setInput("");
  };

  const saveDashboard = async () => {
    if (!dashboardMarkdown) return;

    // Use first user question as dashboard name
    const firstQuestion = messages.find(m => m.role === "user")?.text || "Untitled Dashboard";
    const summaryName = firstQuestion.length > 50 ? firstQuestion.slice(0, 50) + "..." : firstQuestion;

    await axios.post("http://localhost:8000/dashboards", {
      name: summaryName,
      markdown_content: dashboardMarkdown,
    });
    alert("Dashboard saved!");
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
        {dashboardMarkdown && (
          <div className="mt-4 p-2 border rounded bg-gray-50">
            <ReactMarkdown>{dashboardMarkdown}</ReactMarkdown>
            <button onClick={saveDashboard} className="mt-2 px-3 py-1 bg-green-500 text-white rounded">
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
