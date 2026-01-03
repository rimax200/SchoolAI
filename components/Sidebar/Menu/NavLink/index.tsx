"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

type Props = {
    item: {
        title: string;
        icon: LucideIcon;
        href: string;
    };
    isCollapsed: boolean;
};

const NavLink = ({ item, isCollapsed }: Props) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    return (
        <Link
            className={`group flex items-center gap-3 h-10 rounded-xl text-sm transition-colors hover:text-gray-900 ${isCollapsed ? "justify-center w-12 mx-auto" : "px-3 w-full"
                } ${isActive
                    ? "bg-gray-50 text-gray-900 font-medium"
                    : "text-gray-500 hover:bg-gray-25"
                }`}
            href={item.href}
            title={isCollapsed ? item.title : ""}
        >
            <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? "w-10" : ""}`}>
                <item.icon
                    className={`w-5 h-5 transition-colors ${isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                    strokeWidth={isActive ? 2 : 1.5}
                />
            </div>
            {!isCollapsed && <span className="truncate font-medium">{item.title}</span>}
        </Link>
    );
};

export default NavLink;
