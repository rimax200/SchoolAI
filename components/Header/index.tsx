"use client";

import Link from "next/link";
import { Share2, ChevronDown, Trash2, Edit3, Pin, PinOff, Download, Check, X, Menu as MenuIcon } from "lucide-react";
import Image from "@/components/Image";
import { useChatStore } from "@/store/useChatStore";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

type Props = {
    chatId?: string;
    onOpenSidebar: () => void;
};

const Header = ({ chatId, onOpenSidebar }: Props) => {
    const router = useRouter();
    const { chats, deleteChat, renameChat, togglePin } = useChatStore();
    const currentChat = chats.find(c => c.id === chatId);
    const title = currentChat?.title || "Home";

    const [editingTitle, setEditingTitle] = useState(false);
    const [editValue, setEditValue] = useState(title);

    const mobileTitle = title.length > 20 ? title.substring(0, 20) + "..." : title;

    const handleSaveRename = () => {
        if (chatId && editValue.trim()) {
            renameChat(chatId, editValue);
            setEditingTitle(false);
        }
    };

    const handleDelete = () => {
        if (chatId && confirm("Are you sure you want to delete this chat?")) {
            deleteChat(chatId);
            router.push("/chat");
        }
    };

    const handleDownloadPDF = () => {
        if (!currentChat) return;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const width = pageWidth - 2 * margin;

        let y = 30;

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 91, 85); // Theme Color
        doc.text("School AI", margin, y);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        doc.text(new Date().toLocaleDateString(), pageWidth - margin - 25, y);

        y += 15;
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y, pageWidth - margin, y);

        y += 15;
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(33, 33, 33);
        doc.text(currentChat.title || "Study Session", margin, y);

        y += 15;

        currentChat.messages.forEach((msg) => {
            const role = msg.role === "user" ? "Maxwell" : "School AI";

            // Check page break
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(msg.role === "user" ? 0 : 138, msg.role === "user" ? 91 : 68, msg.role === "user" ? 85 : 244);
            doc.text(role, margin, y);
            y += 7;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);

            const lines = doc.splitTextToSize(msg.content, width);
            lines.forEach((line: string) => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, margin, y);
                y += 6.5;
            });
            y += 10;
        });

        doc.save(`${currentChat.title || "study-session"}.pdf`);
    };

    return (
        <div className="relative flex items-center h-18 px-6 border-b border-gray-100 max-2xl:py-5 max-md:fixed max-md:top-0 max-md:left-0 max-md:right-0 max-md:z-20 max-md:h-16 max-md:px-4 max-md:py-0 max-md:bg-gray-0 overflow-visible">
            {/* Mobile Menu Button - Always on the left, no outline/shadow */}
            <button
                className="hidden max-md:flex shrink-0 w-10 h-10 items-center justify-center outline-none bg-transparent hover:bg-gray-50 rounded-lg transition-colors"
                onClick={onOpenSidebar}
            >
                <MenuIcon className="w-6 h-6 text-gray-900" />
            </button>

            <div className="flex items-center gap-2 ml-2 md:ml-0 min-w-0 max-w-[60%] relative overflow-visible">
                {editingTitle ? (
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                        <input
                            autoFocus
                            className="bg-transparent border-none outline-none text-sm font-semibold text-gray-900 w-32 md:w-64"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveRename()}
                            onBlur={() => setEditingTitle(false)}
                        />
                        <button onClick={handleSaveRename} className="text-primary-200"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingTitle(false)} className="text-gray-400"><X className="w-4 h-4" /></button>
                    </div>
                ) : (
                    <Menu as="div" className="relative flex items-center min-w-0 overflow-visible">
                        <MenuButton className="flex items-center gap-1.5 min-w-0 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-[19px] font-semibold text-gray-900 truncate max-md:hidden">
                                {title}
                            </span>
                            <span className="text-[15px] font-semibold text-gray-900 truncate hidden max-md:block">
                                {mobileTitle}
                            </span>
                            {chatId && <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                        </MenuButton>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <MenuItems className="absolute left-0 top-full mt-1 w-48 origin-top-left rounded-xl bg-white p-1 shadow-xl ring-1 ring-gray-900/5 focus:outline-none z-[100]">
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={() => togglePin(chatId!)}
                                            className={`${active ? "bg-gray-50" : ""} flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700`}
                                        >
                                            {currentChat?.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                            {currentChat?.isPinned ? "Unpin chat" : "Pin chat"}
                                        </button>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={() => setEditingTitle(true)}
                                            className={`${active ? "bg-gray-50" : ""} flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700`}
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Rename
                                        </button>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={handleDownloadPDF}
                                            className={`${active ? "bg-gray-50" : ""} flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700`}
                                        >
                                            <Download className="w-4 h-4" />
                                            Export as PDF
                                        </button>
                                    )}
                                </MenuItem>
                                <div className="my-1 border-t border-gray-50" />
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={handleDelete}
                                            className={`${active ? "bg-error-0" : ""} flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-error-100`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete chat
                                        </button>
                                    )}
                                </MenuItem>
                            </MenuItems>
                        </Transition>
                    </Menu>
                )}
            </div>

            <div className="flex items-center gap-4 ml-auto max-md:order-3">
                <Link
                    href="/profile"
                    className="flex items-center gap-2 h-10 pl-1 pr-3 border border-gray-100 rounded-full hover:bg-gray-25 transition-colors max-md:pr-1"
                >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-50">
                        <Image
                            className="w-full h-full object-cover"
                            src="/images/avatar-1.jpg"
                            width={32}
                            height={32}
                            alt="Profile"
                        />
                    </div>
                    <div className="flex flex-col items-start leading-none hidden md:flex">
                        <span className="text-xs font-semibold text-gray-900">Maxwell Ebirim</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">Maxwell@mail.com</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Header;
