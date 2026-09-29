"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Phone, ExternalLink } from "lucide-react";

type Message = {
  id: string;
  sender: "bot" | "user";
  text?: string;
  options?: Array<{
    id: string;
    name: string;
    isTopPick: boolean;
    startingPrice: number;
    speed: number;
    affiliateUrl: string;
    phoneNumber: string;
  }>;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [zip, setZip] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hi! I can instantly check which internet providers are actually active at your address. What is your 5-digit zip code?",
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length !== 5 || isNaN(Number(zip))) return;

    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: zip };
    setMessages((prev) => [...prev, userMessage]);
    setZip("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/bot?zip=${userMessage.text}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        if (data.hasLocal) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + "bot1",
              sender: "bot",
              text: `Great news! I found high-speed local providers available in ${userMessage.text}, plus nationwide 5G options. Here are the best offers:`
            },
            {
              id: Date.now().toString() + "bot2",
              sender: "bot",
              options: data.results
            }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + "bot1",
              sender: "bot",
              text: `It looks like we don't have direct local fiber or cable mapped to that exact zip code yet. However, these Nationwide 5G options are available everywhere:`
            },
            {
              id: Date.now().toString() + "bot2",
              sender: "bot",
              options: data.results
            }
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString() + "err", sender: "bot", text: "Sorry, no offers are currently available in that area." }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + "err", sender: "bot", text: "Sorry, I had trouble connecting to the database. Try again in a moment!" }
      ]);
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90%] max-w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 border border-slate-200 h-[600px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div>
              <h3 className="font-bold text-lg">Internet Deal Finder</h3>
              <p className="text-indigo-200 text-xs">Live Database Check</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none"}`}>
                  {msg.text && <p className="text-sm">{msg.text}</p>}
                  
                  {/* Dynamic Offer Cards */}
                  {msg.options && (
                    <div className="space-y-3 mt-2">
                      {msg.options.map((opt) => (
                        <div key={opt.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col gap-2">
                          {opt.isTopPick && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded-md self-start">
                              🔥 Top Pick
                            </span>
                          )}
                          <div className="flex justify-between items-start">
                            <strong className="text-sm text-slate-900">{opt.name}</strong>
                            {opt.startingPrice && <span className="text-sm font-bold text-green-600">${opt.startingPrice}/mo</span>}
                          </div>
                          
                          <div className="flex flex-col gap-2 mt-2">
                            {opt.affiliateUrl && (
                              <a href={opt.affiliateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">
                                Sign Up Online <ExternalLink size={14} />
                              </a>
                            )}
                            {opt.phoneNumber && (
                              <a href={`tel:${opt.phoneNumber}`} className="flex items-center justify-center gap-1 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors border border-slate-200">
                                Call {opt.phoneNumber} <Phone size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-none p-4 flex gap-1">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\\D/g, '').slice(0, 5))}
                placeholder="Enter 5-digit Zip..."
                className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={zip.length !== 5 || isLoading}
                className="bg-indigo-600 text-white rounded-xl px-4 py-3 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
