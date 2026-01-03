"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    HelpCircle,
    Settings,
    PanelLeft,
    Search,
    Plus,
    MoreHorizontal,
    FolderOpen,
    PieChart,
    Calendar,
    Layers,
    Sparkles,
    Command,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from "@/components/Image"
import Menu from "../Sidebar/Menu"
import Space from "../Sidebar/Space"
import RecentChats from "../Sidebar/RecentChats"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="px-4 py-6">
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
                            <span className="font-bold text-[17px] text-gray-900 whitespace-nowrap tracking-tight font-manrope">
                                School AI
                            </span>
                        )}
                    </Link>

                    {!isCollapsed && (
                        <SidebarMenuButton size="sm" className="w-fit p-1.5 h-auto">
                            <PanelLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                        </SidebarMenuButton>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2">
                <Menu isCollapsed={isCollapsed} />
                {!isCollapsed && (
                    <>
                        <Space />
                        <RecentChats />
                    </>
                )}
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-gray-50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Help Center" isActive={pathname === "/help"}>
                            <Link href="/help">
                                <HelpCircle className="w-5 h-5 text-gray-400" />
                                {!isCollapsed && <span className="font-medium font-manrope">Help Center</span>}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === "/settings"}>
                            <Link href="/settings">
                                <Settings className="w-5 h-5 text-gray-400" />
                                {!isCollapsed && <span className="font-medium font-manrope">Settings</span>}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
