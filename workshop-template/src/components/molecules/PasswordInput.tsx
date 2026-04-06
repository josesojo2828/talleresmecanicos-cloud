import React, { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { Icon } from "@/components/atoms/Icon";

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> { }

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                className="pr-10"
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-ghost btn-sm absolute inset-y-0 right-0 px-3 flex items-center"
            >
                <Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    className="h-5 w-5"
                />
            </button>
        </div>
    );
};

