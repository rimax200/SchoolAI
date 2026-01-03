import { LucideIcon } from "lucide-react";

type ActionCardProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
};

const ActionCard = ({ title, description, icon: Icon, color }: ActionCardProps) => {
    return (
        <div className="flex-1 min-w-[280px] p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={20} className="text-gray-700" />
            </div>
            <h3 className="text-body-md font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-body-xs text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
};

export default ActionCard;
