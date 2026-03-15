import React from "react";
import { UI } from "@/config/ui";

type Variant = keyof typeof UI.TYPOGRAPHY;

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: Variant;
    as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
    variant = "P",
    as,
    className = "",
    children,
    ...props
}) => {
    const Component = as || (variant.startsWith("H") ? variant.toLowerCase() : "p");
    const styles = UI.TYPOGRAPHY[variant];

    // @ts-ignore
    return (
        <Component className={`${styles} ${className}`} {...props}>
            {children}
        </Component>
    );
};
