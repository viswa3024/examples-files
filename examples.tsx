 <div className="grid grid-cols-1 grid-cols-3  gap-4 w-full">
        {agents.map((agent) => (
          <Card key={agent.id} agent={agent} />
        ))}
      </div>



"use client";
import { ArrowRight } from "lucide-react";

type Agent = {
  id: number;
  name: string;
  description: string;
};

export default function Card({ agent }: { agent: Agent }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-semibold text-gray-800">{agent.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
      </div>
      <ArrowRight className="text-gray-400 w-5 h-5 mt-1" />
    </div>
  );
}

