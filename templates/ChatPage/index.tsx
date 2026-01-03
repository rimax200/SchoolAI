"use client";

import { useChatStore } from "@/store/useChatStore";
import Layout from "@/components/Layout";
import Message from "@/components/Message";
import Answer from "@/components/Answer";
import { useEffect, useRef, useState } from "react";

const ChatPage = () => {
    const { chats, currentChatId, isTyping } = useChatStore();
    const currentChat = chats.find(c => c.id === currentChatId);
    const messages = currentChat?.messages || [];

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            // Small delay ensures content is painted before measuring
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }, 100);
        }
    };

    // Smart auto-scroll for streaming
    useEffect(() => {
        if (isTyping) {
            scrollToBottom();
        }
    }, [isTyping, messages.length]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        // Adjusted threshold for better responsiveness
        const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 150;
        setShowScrollButton(!isAtBottom && messages.length > 0);
    };

    return (
        <Layout
            chatId={currentChatId || undefined}
            scrollRef={scrollRef}
            onScroll={handleScroll}
            showScrollButton={showScrollButton}
            scrollToBottom={scrollToBottom}
        >
            <div className="flex flex-col gap-8 md:gap-12 pb-10">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
                        <h1 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-4 tracking-tight">
                            How can I help you today?
                        </h1>
                        <p className="text-gray-500 max-w-md text-[15px] leading-relaxed">
                            Type a message below to start your study session. I can help with homework, explain complex topics, or quiz you.
                        </p>
                    </div>
                ) : (
                    messages.map((item) => (
                        item.role === "user" ? (
                            <Message key={item.id} content={item.content} />
                        ) : (
                            <Answer key={item.id}>{item.content}</Answer>
                        )
                    ))
                )}
                {isTyping && (
                    <Answer>
                        <div className="flex gap-1.5 items-center px-1">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                        </div>
                    </Answer>
                )}
            </div>
        </Layout>
    );
};

export default ChatPage;
