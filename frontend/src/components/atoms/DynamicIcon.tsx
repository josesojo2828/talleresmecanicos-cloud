"use client";

import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { cn } from "@/utils/cn";

export const ALL_CUSTOM_ICONS = [
    "cat-entertainment", "cat-gastronomy", "cat-health-wellness", "cat-professional", "cat-tech-repair", "cat-transport",
    "fin-cart-simple", "fin-chart-up", "fin-crypto-payment", "fin-crypto-wallet", "fin-subscription", "fin-transaction", "fin-user-sub", "fin-wallet",
    "geo-city", "geo-country", "geo-currency", "geo-region", "geo-state",
    "msg-broadcast", "msg-chat-bubble", "msg-inbox", "msg-notification-bell", "msg-urgent",
    "nav-arrow-down", "nav-arrow-left", "nav-arrow-right", "nav-arrow-top",
    "prod-analytics", "prod-discount", "prod-inventory", "prod-quality-seal", "prod-quick-view", "prod-tag",
    "soc-facebook", "soc-instagram", "soc-linkedin", "soc-telegram", "soc-tiktok", "soc-twitter-x", "soc-whatsapp",
    "srv-calendar-booking", "srv-contract-legal", "srv-location-pin", "srv-payment-safe", "srv-review-star", "srv-verification-check",
    "sys-activity-pulse", "sys-device", "sys-host", "sys-load-balancer", "sys-loader", "sys-upload",
    "ui-create", "ui-delete", "ui-find", "ui-home", "ui-pagination", "ui-search", "ui-upload",
    "user-address", "user-auth-login", "user-auth-logout", "user-generic", "user-profile", "user-role-admin", "user-security", "user-session-history", "user-session", "user-settings"
];

// Map sidebar keys to our custom premium SVGs
const CUSTOM_ICON_MAP: Record<string, string> = {
    'user': '/icons/svg/user-generic.svg',
    'region': '/icons/svg/geo-region.svg',
    'subscription': '/icons/svg/fin-subscription.svg',
    'address': '/icons/svg/user-address.svg',
    'device': '/icons/svg/sys-device.svg',
    'notification': '/icons/svg/msg-notification-bell.svg',
    'profile': '/icons/svg/user-profile.svg',
    'session': '/icons/svg/user-session.svg',
    'country': '/icons/svg/geo-country.svg',
    'state': '/icons/svg/geo-state.svg',
    'city': '/icons/svg/geo-city.svg',
};


// Fallback logic for Lucide icons
const LUCIDE_ICON_MAP: Record<string, keyof typeof LucideIcons> = {
    'user': 'Users',
    'region': 'Globe',
    'subscription': 'CreditCard',
    'address': 'MapPin',
    'device': 'Smartphone',
    'notification': 'Bell',
    'profile': 'UserCircle',
    'session': 'Key',
    'country': 'Flag',
    'state': 'MapPinned',
    'city': 'Building2',
};

interface DynamicIconProps {
    name: string;
    className?: string;
}

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
    if (!name) return null;

    // 1. Try Custom SVG first
    const cleanName = name.replace(/\.svg$/, '').toLowerCase();
    let customSrc = CUSTOM_ICON_MAP[cleanName];

    if (!customSrc) {
        const foundIcon = ALL_CUSTOM_ICONS.find(icon => icon.toLowerCase() === cleanName);
        if (foundIcon) {
            customSrc = `/icons/svg/${foundIcon}.svg`;
        }
    }

    if (customSrc) {
        return (
            <div className={cn("relative flex items-center justify-center", className)}>
                <Image
                    src={customSrc}
                    alt={name}
                    width={24}
                    height={24}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,242,254,0.3)]"
                    unoptimized
                />
            </div>
        );
    }

    // 2. Fallback to Lucide
    const lucideName = LUCIDE_ICON_MAP[name.toLowerCase()];
    const fallbackName = (name.charAt(0).toUpperCase() + name.slice(1)) as keyof typeof LucideIcons;
    const IconComponent = (LucideIcons[lucideName] || LucideIcons[fallbackName]) as LucideIcons.LucideIcon;

    if (!IconComponent) {
        return <LucideIcons.HelpCircle className={className} />;
    }

    return <IconComponent className={className} />;
};
