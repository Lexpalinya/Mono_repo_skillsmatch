import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { cn } from '../utils/utils'; // ฟังก์ชันช่วยรวม className

type Option = {
    label: string;
    value: string;
};

type Props<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    options: Option[];
    label?: string;
    require?: boolean;
    rules?: any;
    className?: string;
    classNameLayout?: string;
    detail?: string;
};

export function BaseCheckboxGroup<T extends FieldValues>({
    name,
    control,
    options = [],
    label,
    require = false,
    rules,
    detail,
    className,
    classNameLayout,
}: Readonly<Props<T>>) {
    return (
        <View className={`mb-4 w-full mx-2 ${className ?? ''}`}>
            {label && (
                <View className="flex-row items-center mb-1">
                    <Text className="ml-2 text-sm font-medium text-gray-700">{label}</Text>
                    {require && <Text className="ml-2 text-red-500">*</Text>}
                </View>
            )}

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value = [], onChange }, fieldState: { error } }) => {
                    const selected = value as string[];

                    return (
                        <View className="w-full">
                            <View className={cn('w-full grid gap-4', classNameLayout)}>
                                {options.map((option) => {
                                    const isChecked = selected.includes(option.value);

                                    const toggle = () => {
                                        if (isChecked) {
                                            onChange(selected.filter((v) => v !== option.value));
                                        } else {
                                            onChange([...selected, option.value]);
                                        }
                                    };

                                    return (
                                        <Pressable
                                            key={option.value}
                                            onPress={toggle}
                                            className="flex-row items-center space-x-2 bg-red-700 p-2 rounded"
                                        >
                                            <View
                                                className={`w-5 h-5 border rounded flex items-center justify-center
                          ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}
                        `}
                                            >
                                                {isChecked && <View className="w-3 h-3 bg-white rounded-sm" />}
                                            </View>
                                            <Text className="ml-2 text-gray-800">{option.label}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {error?.message && (
                                <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
                            )}

                            {!error?.message && detail && (
                                <Text className="text-gray-500 text-xs mt-1">{detail}</Text>
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
}
