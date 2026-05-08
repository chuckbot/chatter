import React, { useState, useRef, useEffect } from 'react';

type Message = { id: string; text: string; sender: 'user' | 'bot' };

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
  const text = input.trim();
  if (!text || isStreaming) return;

  // Agregar mensaje del usuario
  const userMsg: Message = {
    id: Date.now().toString(),
    text,
    sender: 'user',
  };
  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setError(null);
  setIsStreaming(true);

  // Crear un mensaje temporal para el bot (vacío)
  const botMsgId = (Date.now() + 1).toString();
  setMessages(prev => [...prev, { id: botMsgId, text: '', sender: 'bot' }]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Conectar al endpoint SSE
  const encodedMsg = encodeURIComponent(text);
  const eventSource = new EventSource(`${API_URL}/chat/stream?message=${encodedMsg}`);

  let accumulated = '';

  eventSource.onmessage = (event) => {
    accumulated += event.data;
    setMessages(prev =>
      prev.map(msg =>
        msg.id === botMsgId ? { ...msg, text: accumulated } : msg
      )
    );
  };

  eventSource.onerror = () => {
    if (eventSource.readyState === EventSource.CLOSED) {
      // Conexión cerrada correctamente por el servidor
      setIsStreaming(false);
      inputRef.current?.focus();
      eventSource.close();
      return;
    }
    // Error real (problema de red, servidor caído, etc.)
    console.error('SSE error', eventSource);
    setError('Connection lost. Please try again.');
    eventSource.close();
    setIsStreaming(false);
  };
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isSendDisabled = input.trim() === '' || isStreaming;

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ background: '#f0f0f0', padding: 12, fontWeight: 'bold' }}>🤖 Chat con Groq (Streaming)</div>
      <div style={{ height: 400, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              background: m.sender === 'user' ? '#007bff' : '#e9ecef',
              color: m.sender === 'user' ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: 12,
              maxWidth: '70%',
              wordWrap: 'break-word',
            }}
          >
            {m.text || (m.sender === 'bot' && '...')}
          </div>
        ))}
        {isStreaming && (
          <div style={{ alignSelf: 'flex-start', background: '#e9ecef', padding: '8px 12px', borderRadius: 12 }}>
            Typing...
          </div>
        )}
        <div ref={endRef} />
      </div>
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: 8, fontSize: 14, textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #ccc' }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          disabled={isStreaming}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          onClick={sendMessage}
          disabled={isSendDisabled}
          style={{
            padding: '8px 16px',
            background: isSendDisabled ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: isSendDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          {isStreaming ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;