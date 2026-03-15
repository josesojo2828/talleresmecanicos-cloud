import { ReactNode } from "react";
import { Typography } from "@/components/atoms/Typography";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    iconBgColor?: string;
    iconRotation?: string;
}

export const FeatureCard = ({
    icon,
    title,
    description,
    iconBgColor = "bg-blue-50",
    iconRotation = "rotate-3"
}: FeatureCardProps) => {
    return (
        <div className="text-center space-y-6 p-8 rounded-3xl hover:bg-base-200 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-base-300 group">
            <div className={`w-20 h-20 ${iconBgColor} text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6 transform ${iconRotation} group-hover:rotate-6 transition-transform duration-300`}>
                {icon}
            </div>
            <Typography variant="H3" className="text-2xl font-bold">
                {title}
            </Typography>
            <p className="opacity-70 leading-relaxed text-lg">
                {description}
            </p>
        </div>
    );
};
