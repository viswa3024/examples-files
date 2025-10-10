"use client";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const [dashboardMarkdown, setDashboardMarkdown] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    setMessages([...messages, { role: "user", text: input }]);

    // Mock bot response
    let botResponse = "";
    if (input.toLowerCase().includes("visualize")) {
      botResponse = "Here is your dashboard in markdown:\n\n```markdown\n## Sales Chart\n- Revenue: $100k\n- Profit: $20k\n```";
      setDashboardMarkdown(botResponse);
    } else {
      botResponse = "Bot reply to: " + input;
    }

    setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
    setInput("");
  };

  const saveDashboard = async () => {
    if (!dashboardMarkdown) return;
    await axios.post("http://localhost:8000/dashboards", {
      name: `Dashboard ${new Date().toLocaleString()}`,
      markdown_content: dashboardMarkdown
    });
    alert("Dashboard saved!");
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <div className="flex-1 overflow-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <p className={`inline-block px-3 py-1 my-1 rounded ${m.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>{m.text}</p>
          </div>
        ))}
        {dashboardMarkdown && (
          <div className="mt-4 p-2 border rounded bg-gray-50">
            <ReactMarkdown>{dashboardMarkdown}</ReactMarkdown>
            <button onClick={saveDashboard} className="mt-2 px-3 py-1 bg-green-500 text-white rounded">Save Dashboard</button>
          </div>
        )}
      </div>

      <div className="flex">
        <input 
          type="text" 
          className="flex-1 border rounded px-3 py-2" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  );
}



"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface Dashboard {
  id: number;
  name: string;
  markdown_content: string;
}

export default function DashboardPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selected, setSelected] = useState<Dashboard | null>(null);

  useEffect(() => {
    axios.get("http://localhost:8000/dashboards").then(res => setDashboards(res.data));
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r p-2 overflow-auto">
        <h2 className="text-xl font-bold mb-2">Dashboards</h2>
        {dashboards.map(d => (
          <div key={d.id} className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => setSelected(d)}>
            {d.name}
          </div>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {selected ? <ReactMarkdown>{selected.markdown_content}</ReactMarkdown> : <p>Select a dashboard to view</p>}
      </div>
    </div>
  );
}
