'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatWidgetProps {
    productId: string;
    productName: string;
    displayedPrice: number;
    onDealAccepted?: (negotiatedPrice: number) => void;
}

export default function ChatWidget({
    productId,
    productName,
    displayedPrice,
    onDealAccepted,
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentOffer, setCurrentOffer] = useState<number>(displayedPrice);
    const [dealAccepted, setDealAccepted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initialize negotiation session
    const startNegotiation = async () => {
        setIsNegotiating(true);

        // Add system message
        addMessage('Connecting you to a negotiation agent...', 'bot');

        try {
            const response = await fetch('/api/tenant/start-negotiation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                const error = await response.json();
                addMessage(
                    error.message || 'Failed to start negotiation. Please check your configuration.',
                    'bot'
                );
                return;
            }

            const data = await response.json();
            setSessionId(data.session_id);

            // Welcome message
            setTimeout(() => {
                addMessage(
                    `Hello! I'm here to help you get the best price on ${productName}. The listed price is $${displayedPrice}. What price are you hoping for?`,
                    'bot'
                );
            }, 800);
        } catch (error) {
            console.error('Error starting negotiation:', error);
            addMessage('Connection error. Please try again later.', 'bot');
        }
    };

    // Add message to chat
    const addMessage = (text: string, sender: 'user' | 'bot') => {
        const newMessage: Message = {
            id: Date.now().toString() + Math.random(),
            text,
            sender,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    // Send message to orchestrator
    const sendMessage = async () => {
        if (!inputText.trim() || !sessionId) return;

        const userMessage = inputText.trim();
        setInputText('');

        // Add user message immediately (Optimistic UI)
        addMessage(userMessage, 'user');

        // Show typing indicator
        setIsTyping(true);

        try {
            // Simulate API call (replace with actual orchestrator endpoint)
            // For demo purposes, simulate a negotiation flow
            setTimeout(() => {
                setIsTyping(false);
                handleNegotiationResponse(userMessage);
            }, 1500);

            /*
            // REPLACE THIS COMMENTED CODE WITH YOUR ACTUAL ORCHESTRATOR CALL:
            const response = await fetch(`${orchestratorUrl}/message`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                session_id: sessionId,
                message: userMessage,
              }),
            });
      
            if (!response.ok) {
              throw new Error('Failed to send message');
            }
      
            const data = await response.json();
            setIsTyping(false);
            
            addMessage(data.response, 'bot');
            
            // Check for deal acceptance
            if (data.negotiation_status === 'deal_accepted') {
              handleDealAccepted(data.negotiated_price);
            } else if (data.current_offer) {
              setCurrentOffer(data.current_offer);
            }
            */
        } catch (error) {
            console.error('Error sending message:', error);
            setIsTyping(false);
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    };

    // Simulate negotiation response (DEMO ONLY - Remove when integrating with real orchestrator)
    const handleNegotiationResponse = (userMessage: string) => {
        const lowerMessage = userMessage.toLowerCase();

        // Extract numbers from user message
        const numbers = userMessage.match(/\d+/g);
        const userOffer = numbers ? parseInt(numbers[0]) : null;

        if (userOffer !== null) {
            // Simulate negotiation logic
            if (userOffer >= displayedPrice * 0.75) {
                // Accept the deal
                handleDealAccepted(userOffer);
            } else if (userOffer >= displayedPrice * 0.6) {
                // Counter offer
                const counter = Math.round(displayedPrice * 0.78);
                setCurrentOffer(counter);
                addMessage(
                    `I appreciate your interest! While $${userOffer} is below what we can offer, I can do $${counter}. That's a great deal! What do you think?`,
                    'bot'
                );
            } else {
                addMessage(
                    `I understand you're looking for a good deal. The absolute best I can do is $${Math.round(displayedPrice * 0.75)}. This is already a significant discount!`,
                    'bot'
                );
            }
        } else {
            addMessage(
                `I'd love to help you get a great price! The current asking price is $${displayedPrice}. What price did you have in mind?`,
                'bot'
            );
        }
    };

    // Handle successful deal
    const handleDealAccepted = (negotiatedPrice: number) => {
        setDealAccepted(true);
        setCurrentOffer(negotiatedPrice);

        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#ec4899', '#f59e0b'],
        });

        // Add success message
        addMessage(
            `🎉 Congratulations! I can offer you ${productName} for $${negotiatedPrice}! You're saving $${displayedPrice - negotiatedPrice}! Click "Claim Offer" below to proceed to checkout.`,
            'bot'
        );

        // Notify parent component
        if (onDealAccepted) {
            onDealAccepted(negotiatedPrice);
        }
    };

    // Handle open  widget
    const handleOpen = () => {
        setIsOpen(true);
        if (!isNegotiating) {
            startNegotiation();
        }
        // Focus input after a short delay
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
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
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                                        AI
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${message.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
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
                        <div className="flex items-center space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={dealAccepted}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputText.trim() || dealAccepted}
                                className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
