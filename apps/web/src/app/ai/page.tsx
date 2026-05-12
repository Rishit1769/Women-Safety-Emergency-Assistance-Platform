'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api/fetcher';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const QUICK_PROMPTS = [
  'What should I do if I feel unsafe?',
  'How do I report harassment to police?',
  'What are my legal rights as a woman?',
  'Share safety tips for traveling alone at night',
];

export default function AiPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hello! I am RakshaAI Assistant 🛡️ I am here to help with safety guidance, legal rights, and emotional support. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (msgs: Message[]) => api.post('/ai/chat', { messages: msgs }),
    onSuccess: (data) => {
      const reply = (data as { data?: { reply?: string } })?.data?.reply ?? 'Sorry, I could not generate a response.';
      setMessages((prev) => [...prev, { role: 'model', content: reply }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: 'I am having trouble connecting right now. Please try again.' },
      ]);
    },
  });

  function send(text: string) {
    if (!text.trim() || chatMutation.isPending) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newMessages);
    setInput('');
    // Send only the non-initial messages (skip the initial greeting)
    const apiMessages = newMessages.filter((_, i) => i > 0);
    chatMutation.mutate(apiMessages);
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-muted hover:text-navy p-1 rounded hover:bg-gray-100">←</button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="text-sm font-bold text-navy">RakshaAI Assistant</p>
            <p className="text-xs text-safe">● Online</p>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-2xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-white text-navy border border-border rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 max-w-2xl w-full mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-white border border-border text-navy hover:bg-gray-50 font-medium shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-border px-4 py-3 max-w-2xl w-full mx-auto">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2 items-end"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask anything about safety…"
            rows={1}
            className="input-field flex-1 resize-none overflow-hidden"
          />
          <button
            type="submit"
            disabled={!input.trim() || chatMutation.isPending}
            className="btn-primary px-4 py-2 disabled:opacity-50 shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
