import { Ionicons } from '@expo/vector-icons';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';

import { cn } from '../utils/utils';

type Props<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    detail?: string;
    require?: boolean;
    rules?: any;
    placeholder?: string;
    className?: string;
    showControl?: boolean;
    min?: number;
    max?: number;
    step?: number;
};

export function BaseNumberInput<T extends FieldValues>({
    name,
    control,
    label,
    detail,
    require = false,
    rules,
    placeholder,
    className,
    showControl = true,
    min = 0,
    max = 100,
    step = 1,
}: Readonly<Props<T>>) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
                const currentValue = typeof value === 'number' ? value : 0;

                const increase = () => {
                    const next = currentValue + step;
                    if (max === undefined || next <= max) onChange(next);
                };

                const decrease = () => {
                    const next = currentValue - step;
                    if (min === undefined || next >= min) onChange(next);
                };

                return (
                    <View className={cn('mb-4 w-full', className)}>
                        {label && (
                            <View className="flex-row items-center">
                                <Text className="ml-2 mb-1 text-sm font-medium text-gray-700">{label}</Text>
                                {require && <Text className="ml-1 text-red-500">*</Text>}
                            </View>
                        )}

                        <View
                            className={cn(
                                'flex-row items-center h-[44px]',
                                error && 'border-red-500'
                            )}
                        >
                            {showControl && (
                                <Pressable onPress={decrease} className="w-10 h-full bg-[#557FFA] items-center justify-center rounded-l-md">
                                    <Ionicons name="remove-circle-outline" size={20} color="#FFFF" />
                                </Pressable>
                            )}

                            <TextInput
                                className={cn("flex-1 text-base w-full text-black text-center border border-gray-300", !showControl && "rounded-md")}
                                keyboardType="numeric"
                                value={value !== undefined && value !== null ? String(value) : ''}
                                onChangeText={(text) => {
                                    const num = parseFloat(text);
                                    if (!isNaN(num)) {
                                        if (max !== undefined && num > max) {
                                            onChange(max);
                                        } else if (min !== undefined && num < min) {
                                            onChange(min);
                                        } else {
                                            onChange(num);
                                        }
                                    } else if (text === '') {
                                        onChange(undefined);
                                    }
                                }}
                                placeholder={placeholder}
                                placeholderTextColor="#9ca3af"
                            />

                            {showControl && (
                                <Pressable
                                    onPress={increase}
                                    className="w-10 h-full bg-[#557FFA] items-center justify-center  rounded-r-md"
                                >
                                    <Ionicons name="add-circle-outline" size={20} color="#FFFF" />
                                </Pressable>)}
                        </View>

                        {error?.message && (
                            <Text className="mt-1 text-sm text-red-500">{error.message}</Text>
                        )}

                        {!error?.message && detail && (
                            <Text className="mt-1 text-xs text-gray-500">{detail}</Text>
                        )}
                    </View>
                );
            }}
        />
    );
}
