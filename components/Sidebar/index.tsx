"use client";

import Link from "next/link";
import { HelpCircle, Settings, X, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Menu from "./Menu";
import Space from "./Space";
import RecentChats from "./RecentChats";

type Props = {
    visible: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggle: () => void;
};

const Sidebar = ({ visible, onClose, isCollapsed, onToggle }: Props) => {
    const pathname = usePathname();

    // Unified Sidebar: 
    // - Desktop (xl+): Standard flex child
    // - Mobile/Tablet: Fixed drawer
    const sidebarClasses = `
        flex flex-col bg-white border-r border-gray-100 transition-all duration-300 z-[150]
        fixed top-0 bottom-0 left-0 xl:static
        ${isCollapsed ? "w-20" : "w-72"}
        ${visible ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
    `;

    return (
        <>
            <aside className={sidebarClasses}>
                <div className="px-4 py-6 shrink-0">
                    <div
                        className={`flex items-center border border-gray-100 rounded-2xl shadow-sm transition-all bg-white ${isCollapsed
                                ? "flex-col py-6 gap-6 items-center"
                                : "flex-row justify-between px-3 py-2.5 gap-3"
                            }`}
                    >
                        <Link className="flex items-center gap-2.5 shrink-0" href="/">
                            <div className="relative w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                <Image
                                    className="w-5.5 opacity-100"
                                    src="/images/logo-circle.png"
                                    width={22}
                                    height={22}
                                    alt="Logo"
                                />
                            </div>
                            {!isCollapsed && (
                                <span className="font-bold text-[17px] text-gray-900 whitespace-nowrap tracking-tight">
                                    School AI
                                </span>
                            )}
                        </Link>

                        <button
                            className={`p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all active:scale-90 flex items-center justify-center ${isCollapsed ? "w-10 h-10" : ""
                                }`}
                            onClick={onToggle}
                        >
                            <PanelLeft className={`w-5 h-5 ${isCollapsed ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                </div>

                <div className="grow overflow-y-auto scrollbar-none px-2 flex flex-col gap-1">
                    <Menu isCollapsed={isCollapsed} />
                    {!isCollapsed && (
                        <>
                            <Space />
                            <RecentChats />
                        </>
                    )}
                </div>

                <div className={`mt-auto p-4 flex flex-col gap-1 border-t border-gray-50 ${isCollapsed ? "items-center px-1" : ""}`}>
                    <Link
                        href="/help"
                        title="Help Center"
                        className={`group flex items-center gap-3 h-11 rounded-xl text-sm transition-colors hover:text-gray-900 ${isCollapsed ? "justify-center w-12" : "px-3 w-full"
                            } ${pathname === "/help" ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-25"}`}
                    >
                        <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0" strokeWidth={1.5} />
                        {!isCollapsed && <span className="truncate font-medium">Help Center</span>}
                    </Link>
                    <Link
                        href="/settings"
                        title="Settings"
                        className={`group flex items-center gap-3 h-11 rounded-xl text-sm transition-colors hover:text-gray-900 ${isCollapsed ? "justify-center w-12" : "px-3 w-full"
                            } ${pathname === "/settings" ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-25"}`}
                    >
                        <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0" strokeWidth={1.5} />
                        {!isCollapsed && (
                            <>
                                <span className="truncate font-medium">Settings</span>
                                <Icon name="chevron" className="w-3 h-3 ml-auto fill-gray-300" />
                            </>
                        )}
                    </Link>
                </div>

                <button
                    onClick={onClose}
                    className={`absolute top-4 right-[-50px] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg xl:hidden transition-opacity duration-300 ${visible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                        }`}
                >
                    <X className="w-6 h-6 text-gray-900" />
                </button>
            </aside>

            {/* Overlay for mobile/tablet */}
            <div
                className={`fixed inset-0 z-[140] bg-gray-900/40 backdrop-blur-[2px] transition-all xl:hidden ${visible ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            ></div>
        </>
    );
};

export default Sidebar;
