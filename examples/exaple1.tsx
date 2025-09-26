"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Paperclip, X } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text?: string; image?: File }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() || image) {
      //@ts-ignore
      setMessages([...messages, { text: input.trim(), image }]);
      setInput("");
      setImage(null);
      if (textareaRef.current) textareaRef.current.style.height = "40px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // reset
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px"; // max 120px
    }
  };

  return (
    <div>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white shadow-xl rounded-2xl flex flex-col border border-gray-200"
             style={{ maxHeight: "68vh", minHeight: "68vh" }}>
          {/* Header */}
          <div className="p-3 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-2xl">
            <h2 className="font-semibold">Chatbot</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            className="p-3 space-y-3 bg-gray-50 overflow-y-auto flex-1"
            style={{ height: "62vh" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  idx % 2 === 0 ? "items-start" : "items-end"
                } space-y-1 text-sm`}
              >
                {msg.text && (
                  <div className="bg-gray-200 px-3 py-2 rounded-lg max-w-[80%]">
                    {msg.text}
                  </div>
                )}
                {msg.image && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={URL.createObjectURL(msg.image)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <span className="text-xs text-gray-600 truncate max-w-[120px]">
                      {msg.image.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-3 border-t flex items-end space-x-2">
            <label className="cursor-pointer">
              <Paperclip size={20} className="text-gray-600" />
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm max-h-[120px] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
