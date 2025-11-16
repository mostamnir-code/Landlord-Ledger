import React, { useState, useRef, useEffect } from 'react';
import type { Property, Transaction, Tenant } from '../types';
import { getFinancialInsight } from '../services/geminiService';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.184c0-1.671.679-3.218 1.804-4.352a.75.75 0 011.06.042z" clipRule="evenodd" />
    <path d="M3.085 13.584a.75.75 0 01-1.06-.042 6.75 6.75 0 01-1.804-4.352V1.5a.75.75 0 01.75-.75C7.305 1.5 11.805 3.883 14.685 7.584a.75.75 0 01-1.06 1.06A6.75 6.75 0 013.085 13.584z" />
  </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);


interface AIAssistantProps {
  properties: Property[];
  transactions: Transaction[];
  tenants: Tenant[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ properties, transactions, tenants }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{ sender: 'ai', text: "Hello! How can I help you analyze your properties' finances today?" }]);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getFinancialInsight(input, properties, transactions, tenants);
    
    const aiMessage: Message = { sender: 'ai', text: aiResponse };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-transform transform hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <SparklesIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] sm:w-96 h-[70vh] sm:h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200">
      <header className="flex items-center justify-between p-4 border-b bg-slate-50 rounded-t-2xl">
        <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-bold text-slate-800">AI Financial Assistant</h3>
        </div>
        <button
          onClick={toggleOpen}
          className="text-slate-500 hover:text-slate-800"
          aria-label="Close AI Assistant"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto bg-slate-100/50">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 border'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl px-4 py-2 bg-white text-slate-700 border">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="w-full px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:bg-primary-300"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
