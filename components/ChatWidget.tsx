'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

// Shared message shape — owned by the parent page
export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

interface ChatWidgetProps {
    productId: string;
    productName: string;
    displayedPrice: number;
    // Lifted state — owned by parent
    sessionId: string | null;
    chatHistory: ChatMessage[];
    setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    isAwaitingNetwork: boolean;
    setIsAwaitingNetwork: React.Dispatch<React.SetStateAction<boolean>>;
    onDealAccepted: (price: number) => void;
}

export default function ChatWidget({
    productId,
    productName,
    displayedPrice,
    sessionId,
    chatHistory,
    setChatHistory,
    isAwaitingNetwork,
    setIsAwaitingNetwork,
    onDealAccepted,
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [inputText, setInputText] = useState('');
    const [dealAccepted, setDealAccepted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isAwaitingNetwork]);

    // Initialize negotiation session
    // Session is always pre-provided by the parent via /api/start-session.
    // This function fires when the widget opens and posts a welcome message.
    const startNegotiation = () => {
        setIsNegotiating(true);
        if (sessionId) {
            setTimeout(() => {
                setChatHistory((prev) => [
                    ...prev,
                    {
                        role: 'ai',
                        text: `Hello! I'm here to help you get the best price on ${productName}. The listed price is $${displayedPrice}. What price are you hoping for?`,
                    },
                ]);
            }, 800);
        }
    };

    // --- External Dispatch: onSubmit handler ---
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userText = inputText.trim();
        if (!userText || !sessionId || isAwaitingNetwork || dealAccepted) return;

        // Optimistic UI — append user message instantly and clear input
        setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
        setInputText('');

        setIsAwaitingNetwork(true);
        try {
            const res = await fetch(
                process.env.NEXT_PUBLIC_INA_ORCHESTRATOR_CHAT_URL as string,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId, user_text: userText }),
                }
            );

            if (!res.ok) throw new Error(`Orchestrator error: ${res.status}`);

            const response = await res.json();

            // Append AI reply to shared history
            setChatHistory((prev) => [
                ...prev,
                { role: 'ai', text: response.response_text },
            ]);

            // --- Success Protocol ---
            if (response.negotiation_status === 'deal_accepted') {
                setDealAccepted(true); // disables input
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#ec4899', '#f59e0b'],
                });
                onDealAccepted(response.final_price);
            }
        } catch (err) {
            console.error('Orchestrator fetch failed:', err);
            setChatHistory((prev) => [
                ...prev,
                { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' },
            ]);
        } finally {
            setIsAwaitingNetwork(false);
        }
    };



    // Handle open widget
    const handleOpen = () => {
        setIsOpen(true);
        if (!isNegotiating) {
            startNegotiation();
        }
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
                    aria-label="Open negotiation chat"
                >
                    <MessageCircle className="w-7 h-7" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                        !
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div>
                                <h3 className="font-semibold">Negotiation Assistant</h3>
                                <p className="text-xs opacity-90">Online</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatHistory.map((message, idx) => (
                            <div
                                key={idx}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                                        AI
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${message.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator — shown while awaiting AI response */}
                        {isAwaitingNetwork && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                                    AI
                                </div>
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <form onSubmit={onSubmit} className="flex items-center space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type your message..."
                                disabled={dealAccepted || isAwaitingNetwork}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || dealAccepted || isAwaitingNetwork}
                                className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
