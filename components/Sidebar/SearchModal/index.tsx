"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogPanel, DialogBackdrop, Transition, TransitionChild } from "@headlessui/react";
import { Search, X, MessageCircle, PencilLine, Command } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const SearchModal = ({ isOpen, onClose }: Props) => {
    const router = useRouter();
    const { chats, setCurrentChat, createNewChat } = useChatStore();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredChats = useMemo(() => {
        if (!searchQuery.trim()) return chats;
        return chats.filter((chat) =>
            chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [chats, searchQuery]);

    const groupedChats = useMemo(() => {
        const groups: { [key: string]: typeof chats } = {
            "Today": [],
            "Yesterday": [],
            "Previous 7 Days": [],
            "Previous 30 Days": [],
            "Older": [],
        };

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const sevenDays = 7 * oneDay;
        const thirtyDays = 30 * oneDay;

        filteredChats.forEach((chat) => {
            const diff = now - chat.lastUpdated;
            if (diff < oneDay) groups["Today"].push(chat);
            else if (diff < 2 * oneDay) groups["Yesterday"].push(chat);
            else if (diff < sevenDays) groups["Previous 7 Days"].push(chat);
            else if (diff < thirtyDays) groups["Previous 30 Days"].push(chat);
            else groups["Older"].push(chat);
        });

        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [filteredChats]);

    const handleSelectChat = (id: string) => {
        setCurrentChat(id);
        router.push("/chat");
        onClose();
    };

    const handleNewChat = () => {
        const id = createNewChat();
        setCurrentChat(id);
        router.push("/chat");
        onClose();
    };

    return (
        <Transition show={isOpen} as="div">
            <Dialog onClose={onClose} className="relative z-[200]">
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <DialogBackdrop className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto px-4 py-12 sm:py-24">
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="mx-auto w-full max-w-xl transition-all transform bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                            {/* Search Input Area */}
                            <div className="relative border-b border-gray-100">
                                <Search className="absolute left-4 top-4.5 w-5 h-5 text-gray-400" strokeWidth={2} />
                                <input
                                    autoFocus
                                    className="w-full h-14 pl-12 pr-12 text-gray-900 placeholder:text-gray-400 text-[16px] outline-none font-medium"
                                    placeholder="Search chats..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-12 top-4 p-1 rounded-md hover:bg-gray-50 text-gray-400"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                                <div className="absolute right-4 top-4 px-1.5 py-0.5 border border-gray-100 rounded text-[10px] font-bold text-gray-400 bg-gray-50">
                                    ESC
                                </div>
                            </div>

                            {/* New Chat Button */}
                            <div className="p-2 border-b border-gray-100">
                                <button
                                    onClick={handleNewChat}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-900 transition-colors group"
                                >
                                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm transition-all text-gray-900">
                                        <PencilLine className="w-4 h-4" />
                                    </div>
                                    <span
                                        className="text-[14px] font-medium text-gray-900"
                                        style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                                    >
                                        New chat
                                    </span>
                                    <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="px-1.5 py-0.5 border border-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase">
                                            New
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Recent Chats Content */}
                            <div className="max-h-[60vh] overflow-y-auto scrollbar-none p-2">
                                {groupedChats.length > 0 ? (
                                    groupedChats.map(([groupName, items]) => (
                                        <div key={groupName} className="mb-4 last:mb-0">
                                            <div className="px-3 py-2 text-[11px] font-bold text-gray-400">
                                                {groupName}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                {items.map((chat) => (
                                                    <button
                                                        key={chat.id}
                                                        onClick={() => handleSelectChat(chat.id)}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-900 transition-colors text-left group"
                                                    >
                                                        <MessageCircle className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                                                        <span className="text-[14px] font-medium truncate flex-1">
                                                            {chat.title}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                            <Search className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-[14px] font-medium text-gray-400">
                                            No recent chats found for "{searchQuery}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default SearchModal;
