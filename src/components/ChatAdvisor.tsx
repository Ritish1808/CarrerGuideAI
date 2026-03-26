import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, User, Bot, Loader2, X } from "lucide-react";
import { ChatMessage, UserProfile } from "../types";
import { chatWithAdvisor } from "../services/gemini";

interface ChatAdvisorProps {
  profile: UserProfile;
}

export function ChatAdvisor({ profile }: ChatAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", text: `Hi ${profile.name}! I'm your AI career advisor. Based on your profile, I can help you with career choices, learning paths, or interview prep. What's on your mind?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAdvisor([...messages, userMessage], profile);
      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch (error) {
      console.error("Chat failed:", error);
      setMessages((prev) => [...prev, { role: "model", text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-dark-surface rounded-[2rem] shadow-2xl border border-dark-border flex flex-col overflow-hidden"
          >
            <div className="p-6 bg-brand-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Career Advisor</h3>
                  <p className="text-[10px] opacity-80">Online & Ready to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-brand-600 text-white rounded-tr-none" 
                      : "bg-dark-bg text-dark-muted rounded-tl-none border border-dark-border"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-dark-bg p-4 rounded-2xl rounded-tl-none border border-dark-border">
                    <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-dark-border bg-dark-bg flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 p-3 bg-dark-surface border border-dark-border rounded-xl text-sm text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-dark-muted/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg shadow-brand-500/20 flex items-center justify-center hover:bg-brand-700 transition-all hover:scale-110 active:scale-95"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
