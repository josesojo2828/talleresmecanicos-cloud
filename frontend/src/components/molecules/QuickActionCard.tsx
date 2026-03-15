import { Icon } from "@/components/atoms/Icon";
import { IconName } from "@/config/icons";

interface QuickActionCardProps {
    icon: IconName;
    title: string;
    description: string;
    onClick?: () => void;
}

export const QuickActionCard = ({ icon, title, description, onClick }: QuickActionCardProps) => {
    return (
        <button
            onClick={onClick}
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] text-left"
        >
            {/* Icon */}
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all group-hover:rotate-6">
                <Icon icon={icon} className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-white font-sans font-bold text-lg mb-1">
                {title}
            </h3>
            <p className="text-blue-100/80 font-sans text-sm leading-relaxed">
                {description}
            </p>

            {/* Hover Arrow */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon icon="arrow-right" className="w-5 h-5 text-white" />
            </div>
        </button>
    );
};
