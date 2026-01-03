import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

type NavLinkProps = {
    item: {
        title: string;
        icon: LucideIcon;
        href: string;
    };
    isCollapsed: boolean;
};

const NavLink = ({ item, isCollapsed }: NavLinkProps) => {
    const pathname = usePathname();
    const active = pathname === item.href;
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active
                    ? "bg-gray-50 text-gray-900 font-medium"
                    : "text-gray-500 hover:bg-gray-25 hover:text-gray-900"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
        >
            <Icon
                size={20}
                className={active ? "text-gray-900" : "text-gray-400"}
            />
            {!isCollapsed && <span className="text-body-sm">{item.title}</span>}
        </Link>
    );
};

export default NavLink;
