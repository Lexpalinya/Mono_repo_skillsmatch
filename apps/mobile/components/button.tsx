import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { cn } from "../utils/utils";

type BaseButtonProps = {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    textClassName?: string;
};

export default function BaseButton({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    className = "",
    textClassName = "",
}: Readonly<BaseButtonProps>) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading || disabled}
            className={cn(
                "w-full flex-row items-center justify-center rounded-md bg-[#557FFA] px-4 py-3 ",
                (isLoading || disabled) && "opacity-50",
                className
            )}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading || disabled }}
        >
            {isLoading &&
                <ActivityIndicator color="#fff" />
            }
            <Text className={cn("ml-1 text-white text-base font-medium", textClassName)}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}
