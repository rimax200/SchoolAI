"use client";

import { useState } from "react";
import { Home, Search, BarChart2, BookOpen, Files } from "lucide-react";
import Modal from "@/components/Modal";
import SearchModal from "../SearchModal";
import NavLink from "./NavLink";
import Button from "./Button";
import Space from "./Space";
import ArchivedChat from "./ArchivedChat";

type Props = {
    isCollapsed: boolean;
};

const Menu = ({ isCollapsed }: Props) => {
    const [openModalSpace, setOpenModalSpace] = useState(false);
    const [openModalArchivedChat, setOpenModalArchivedChat] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);

    const items = [
        {
            title: "Home",
            icon: Home,
            href: "/",
        },
        {
            title: "Search",
            icon: Search,
            href: "/search",
        },
        {
            title: "Study Tracker",
            icon: BarChart2,
            href: "/tracker",
        },
        {
            title: "The Library",
            icon: BookOpen,
            href: "/library",
        },
        {
            title: "Workspace",
            icon: Files,
            href: "/workspace",
        },
    ];

    return (
        <>
            <div
                className={`py-4 border-b border-gray-100 ${isCollapsed ? "px-1.5" : "px-3"
                    }`}
            >
                {!isCollapsed && (
                    <div className="mb-2 px-3 text-xs font-medium text-gray-400">Menu</div>
                )}
                <div className="">
                    {items.map((item, index) => {
                        if (item.title === "Search") {
                            return (
                                <button
                                    key={index}
                                    onClick={() => setOpenSearchModal(true)}
                                    className={`group flex items-center gap-3 h-10 rounded-xl text-sm transition-colors hover:text-gray-900 ${isCollapsed ? "justify-center w-12 mx-auto" : "px-3 w-full"
                                        } text-gray-500 hover:bg-gray-25`}
                                    title={isCollapsed ? item.title : ""}
                                >
                                    <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? "w-10" : ""}`}>
                                        <item.icon
                                            className="w-5 h-5 transition-colors text-gray-400 group-hover:text-gray-600"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    {!isCollapsed && <span className="truncate font-medium">{item.title}</span>}
                                </button>
                            );
                        }
                        return item.href ? (
                            <NavLink
                                isCollapsed={isCollapsed}
                                item={item as any}
                                key={index}
                            />
                        ) : (
                            <Button
                                isCollapsed={isCollapsed}
                                item={item as any}
                                key={index}
                            />
                        );
                    })}
                </div>
            </div>
            <SearchModal
                isOpen={openSearchModal}
                onClose={() => setOpenSearchModal(false)}
            />
            <Modal
                classWrapper="relative max-w-100 px-5 py-4 bg-gray-0 rounded-xl border border-gray-50"
                classButtonClose="!top-4.5 !right-4 size-auto [&_svg]:!size-5 max-md:!size-auto"
                open={openModalSpace}
                onClose={() => setOpenModalSpace(false)}
            >
                <Space />
            </Modal>
            <Modal
                classWrapper="relative max-w-100 px-5 py-4 bg-gray-0 rounded-xl border border-gray-50"
                classButtonClose="!top-4.5 !right-4 size-auto [&_svg]:!size-5 max-md:!size-auto"
                open={openModalArchivedChat}
                onClose={() => setOpenModalArchivedChat(false)}
            >
                <ArchivedChat />
            </Modal>
        </>
    );
};

export default Menu;
