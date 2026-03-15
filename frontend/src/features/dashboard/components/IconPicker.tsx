"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { ALL_CUSTOM_ICONS } from "@/components/atoms/DynamicIcon";
import { cn } from "@/utils/cn";


// Una lista cuidadosamente seleccionada de iconos comunes para evitar cargar +1000 SVGs
const DEFAULT_ICONS = [
    ...ALL_CUSTOM_ICONS,
    // General
    "Home", "Settings", "User", "Users", "Search", "Menu", "Check", "X", "Plus", "Minus",
    "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ChevronRight", "ChevronLeft", "ChevronUp", "ChevronDown",
    // UI Elements
    "Star", "Heart", "Trash", "Trash2", "Edit", "Edit2", "Copy", "Save", "Share", "Share2", "MoreVertical", "MoreHorizontal",
    "Eye", "EyeOff", "Lock", "Unlock", "Filter", "Download", "Upload", "RefreshCw", "ExternalLink", "Link",
    // Data & Content
    "File", "FileText", "Folder", "FolderOpen", "Image", "Camera", "Video", "Music", "List", "Grid",
    "Database", "Cloud", "Server", "PieChart", "BarChart", "TrendingUp", "Activity", "Calendar", "Clock",
    // Communication
    "MessageCircle", "MessageSquare", "Mail", "Phone", "Bell", "ThumbsUp", "ThumbsDown", "Wifi",
    // E-commerce/Finance
    "CreditCard", "DollarSign", "ShoppingCart", "ShoppingBag", "Tag", "Box", "Truck", "Award", "Briefcase",
    // Miscellaneous
    "MapPin", "Map", "Navigation", "Compass", "Zap", "Shield", "ShieldCheck", "Sun", "Moon", "Key",
    "Headphones", "Microphone", "Monitor", "Smartphone", "Tablet", "Laptop", "Cpu", "PenTool", "Scissors",
    "Coffee", "Smile"
];

interface IconPickerProps {
    value?: string;
    onChange: (iconName: string) => void;
    error?: boolean;
    disabled?: boolean;
}

export const IconPicker = ({ value, onChange, error, disabled }: IconPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Filtrar iconos memoizados
    const filteredIcons = useMemo(() => {
        if (!search) return DEFAULT_ICONS;
        const lowerSearch = search.toLowerCase();
        return DEFAULT_ICONS.filter(icon => icon.toLowerCase().includes(lowerSearch));
    }, [search]);

    const handleSelect = (iconName: string) => {
        onChange(iconName);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3 bg-base-100 border border-base-300 rounded-2xl shadow-sm transition-all duration-200 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                    error && "border-error focus:ring-error/20",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <div className="flex items-center gap-3">
                    {value ? (
                        <>
                            <div className="flex p-2 bg-primary/10 text-primary rounded-xl items-center justify-center">
                                <DynamicIcon name={value} className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold tracking-wide text-slate-700">{value}</span>
                        </>
                    ) : (
                        <span className="text-sm text-slate-400 font-medium">Seleccionar Icono...</span>
                    )}
                </div>
                <DynamicIcon name="ChevronDown" className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Search Input */}
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DynamicIcon name="Search" className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-400"
                                placeholder={"Buscar icono..."}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Icon Grid */}
                    <div className="p-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {filteredIcons.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {filteredIcons.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => handleSelect(icon)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-transparent transition-all duration-200",
                                            "hover:bg-primary/5 hover:border-primary/20 hover:scale-105 hover:text-primary hover:shadow-sm",
                                            value === icon ? "bg-primary/10 border-primary/30 text-primary" : "text-slate-500 bg-slate-50 border-slate-100"
                                        )}
                                        title={icon}
                                    >
                                        <DynamicIcon name={icon} className="w-6 h-6" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
                                <DynamicIcon name="Search" className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">No se encontraron iconos</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
