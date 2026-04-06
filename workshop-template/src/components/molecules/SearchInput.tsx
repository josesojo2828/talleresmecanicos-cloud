import React from "react";
import { Input } from "@/components/atoms/Input";
import { Icon } from "@/components/atoms/Icon";

interface SearchInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
    onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    className = "",
    value,
    onClear,
    onChange,
    ...props
}) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Icon icon="search" className="h-5 w-5 opacity-50" />
            </div>
            <Input
                type="text"
                className={`pl-10 pr-10 ${className}`}
                value={value}
                onChange={onChange}
                {...props}
            />
            {value && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="btn btn-ghost btn-xs btn-circle absolute inset-y-0 right-2 my-auto"
                >
                    <Icon icon="close" className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

