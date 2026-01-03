"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export type Chat = {
    id: string;
    title: string;
    messages: Message[];
    lastUpdated: number;
    mode: "tutor" | "exam";
    isPinned: boolean;
};

interface ChatStore {
    chats: Chat[];
    currentChatId: string | null;
    isTyping: boolean;
    currentMode: "tutor" | "exam";
    rateLimitWait: number | null; // Seconds to wait
    setMode: (mode: "tutor" | "exam") => void;
    createNewChat: (initialMessage?: string) => string;
    addMessage: (chatId: string, role: "user" | "assistant", content: string) => string;
    updateMessage: (chatId: string, messageId: string, content: string) => void;
    sendMessage: (content: string) => Promise<void>;
    regenerateMessage: (chatId: string) => Promise<void>;
    deleteChat: (chatId: string) => void;
    renameChat: (chatId: string, newTitle: string) => void;
    togglePin: (chatId: string) => void;
    getChatMessages: (chatId: string) => Message[];
    setCurrentChat: (chatId: string | null) => void;
    _executeStream: (chatId: string, model: string) => Promise<void>;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            chats: [],
            currentChatId: null,
            isTyping: false,
            currentMode: "tutor",
            rateLimitWait: null,

            setMode: (mode) => set({ currentMode: mode }),

            createNewChat: (initialMessage) => {
                const id = Math.random().toString(36).substring(7);
                // Use a short snippet of the message as initial title
                const tempTitle = initialMessage
                    ? (initialMessage.length > 40 ? initialMessage.substring(0, 40) + "..." : initialMessage)
                    : "New Chat";
                const newChat: Chat = {
                    id,
                    title: tempTitle,
                    messages: [],
                    lastUpdated: Date.now(),
                    mode: get().currentMode,
                    isPinned: false,
                };
                set((state) => ({
                    chats: [newChat, ...state.chats],
                    currentChatId: id,
                }));
                return id;
            },

            getChatMessages: (chatId) => {
                const chat = get().chats.find((c) => c.id === chatId);
                return chat ? chat.messages : [];
            },

            deleteChat: (chatId) => {
                set((state) => ({
                    chats: state.chats.filter((c) => c.id !== chatId),
                    currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
                }));
            },

            renameChat: (chatId, newTitle) => {
                set((state) => ({
                    chats: state.chats.map((c) =>
                        c.id === chatId ? { ...c, title: newTitle } : c
                    ),
                }));
            },

            togglePin: (chatId) => {
                set((state) => ({
                    chats: state.chats.map((c) =>
                        c.id === chatId ? { ...c, isPinned: !c.isPinned } : c
                    ),
                }));
            },

            setCurrentChat: (chatId) => {
                set({ currentChatId: chatId });
            },

            addMessage: (chatId, role, content) => {
                const messageId = Math.random().toString(36).substring(7);
                set((state) => ({
                    chats: state.chats.map((c) =>
                        c.id === chatId
                            ? {
                                ...c,
                                messages: [
                                    ...c.messages,
                                    { id: messageId, role, content },
                                ],
                                lastUpdated: Date.now(),
                            }
                            : c
                    ),
                }));
                return messageId;
            },

            updateMessage: (chatId, messageId, content) => {
                set((state) => ({
                    chats: state.chats.map((c) =>
                        c.id === chatId
                            ? {
                                ...c,
                                messages: c.messages.map((m) =>
                                    m.id === messageId ? { ...m, content } : m
                                ),
                            }
                            : c
                    ),
                }));
            },

            sendMessage: async (content) => {
                let chatId = get().currentChatId;
                const isFirstMessage = !chatId;

                if (!chatId) {
                    chatId = get().createNewChat(content);
                }

                const chat = get().chats.find((c) => c.id === chatId);
                const mode = chat?.mode || get().currentMode;
                const model = mode === "exam" ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";

                // Add user message
                get().addMessage(chatId, "user", content);
                set({ isTyping: true, rateLimitWait: null });

                // If it's the first message, generate a summary title
                if (isFirstMessage) {
                    await get()._executeStream(chatId, model);

                    // Generate title after stream
                    const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
                    fetch("https://api.groq.com/openai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${API_KEY}`,
                        },
                        body: JSON.stringify({
                            messages: [
                                { role: "system", content: "Summarize the user's request into a short, concise academic title (max 5-6 words). Do not use quotes or prefixes. Just return the summary." },
                                { role: "user", content: content }
                            ],
                            model: "llama-3.1-8b-instant",
                            temperature: 0.5,
                            max_tokens: 30,
                        }),
                    }).then(res => res.json()).then(data => {
                        const newTitle = data.choices?.[0]?.message?.content?.trim().replace(/^["']|["']$/g, '');
                        if (newTitle && chatId) {
                            get().renameChat(chatId, newTitle);
                        }
                    }).catch(err => console.error("Title Generation Error:", err));
                } else {
                    await get()._executeStream(chatId, model);
                }
            },

            regenerateMessage: async (chatId) => {
                const chat = get().chats.find((c) => c.id === chatId);
                if (!chat || chat.messages.length === 0) return;

                // Remove last assistant message if it exists
                const lastMsg = chat.messages[chat.messages.length - 1];
                if (lastMsg.role === "assistant") {
                    set((state) => ({
                        chats: state.chats.map((c) =>
                            c.id === chatId
                                ? { ...c, messages: c.messages.slice(0, -1) }
                                : c
                        ),
                    }));
                }

                // Get last user message content
                const lastUserMsg = chat.messages.filter(m => m.role === 'user').pop();
                if (lastUserMsg) {
                    set({ isTyping: true, rateLimitWait: null });
                    const model = chat.mode === "exam" ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";
                    await get()._executeStream(chatId, model);
                }
            },

            _executeStream: async (chatId, model) => {
                const chat = get().chats.find((c) => c.id === chatId);
                if (!chat) return;

                const lastMessages = chat.messages.slice(-10);
                const relevantSnippets = ""; // Placeholder for library logic

                const apiMessages = [
                    {
                        role: "system",
                        content: `You are a highly capable academic assistant for 'School AI'. 
                        Ground your responses in educational best practices. 
                        Use Markdown for formatting (**bold**, *italics*, lists, code blocks, etc.).
                        Always ensure double spacing between paragraphs for better readability.
                        If the mode is 'exam', focus on creating rigorous exam questions and providing detailed feedback.
                        If the mode is 'tutor', focus on explaining concepts simply and guiding the student.
                        Match the student's language.
                        
                        ${relevantSnippets ? `Relevant Library Knowledge:\n${relevantSnippets}` : ""}`
                    },
                    ...lastMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                ];

                const fetchWithRetry = async (retries = 3, backoff = 1000): Promise<Response> => {
                    const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";

                    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${API_KEY}`,
                        },
                        body: JSON.stringify({
                            messages: apiMessages,
                            model,
                            temperature: 0.7,
                            max_tokens: 2048,
                            stream: true,
                        }),
                    });

                    if (response.status === 429 && retries > 0) {
                        const resetHeader = response.headers.get("x-ratelimit-reset-requests");
                        if (resetHeader) {
                            const seconds = Math.ceil(parseFloat(resetHeader));
                            set({ rateLimitWait: seconds });
                        }
                        await wait(backoff);
                        return fetchWithRetry(retries - 1, backoff * 2);
                    }

                    return response;
                };

                try {
                    const response = await fetchWithRetry();
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error?.message || "API call failed");
                    }

                    const reader = response.body?.getReader();
                    const decoder = new TextDecoder();
                    let aiMessageId = get().addMessage(chatId, "assistant", "");
                    let fullContent = "";

                    if (reader) {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value);
                            const lines = chunk.split("\n");

                            for (const line of lines) {
                                if (line.startsWith("data: ")) {
                                    const data = line.slice(6);
                                    if (data === "[DONE]") break;
                                    try {
                                        const json = JSON.parse(data);
                                        const delta = json.choices?.[0]?.delta?.content || "";
                                        fullContent += delta;
                                        get().updateMessage(chatId, aiMessageId, fullContent);
                                    } catch (e) {
                                        // Ignore parse errors
                                    }
                                }
                            }
                        }
                    }
                } catch (error: any) {
                    console.error("Groq Error:", error);
                    get().addMessage(chatId, "assistant", `⚠️ Error: ${error.message || "I encountered an error connecting to Groq."}`);
                } finally {
                    set({ isTyping: false, rateLimitWait: null });
                }
            }
        }),
        {
            name: "school-ai-chats",
        }
    )
);
