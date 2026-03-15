import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
        <div className={`card bg-base-100 shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`px-6 py-4 border-b border-base-200 ${className}`}>
        {children}
    </div>
);

export const CardBody: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`card-body ${className}`}>
        {children}
    </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`px-6 py-4 bg-base-200 rounded-b-lg border-t border-base-200 ${className}`}>
        {children}
    </div>
);

