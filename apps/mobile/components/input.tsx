// components/BaseTextInput.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { cn } from '../utils/utils';

type Props<T extends FieldValues> = {
    name: Path<T>;
    detail?: string;
    require?: boolean
    label?: string;
    control: Control<T>;
    rules?: any;
    placeholder?: string;
    secureTextEntry?: boolean;
    className?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric';
};

export function BaseTextInput<T extends FieldValues>({
    name,
    detail,
    require = false,
    label,
    control,
    rules,
    placeholder,
    secureTextEntry,
    className,
    keyboardType = 'default',
}: Readonly<Props<T>>) {
    const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View className={cn('mb-4 w-full', className)}>
                    {label && (
                        <View className='flex-row'>

                            <Text className="ml-2 mb-1 text-sm font-medium text-gray-700">{label}</Text>
                            {require && <Text className='ml-2 text-red-500'>*</Text>}
                        </View>
                    )}
                    <View
                        className={cn(
                            'flex-row items-center rounded-md border border-gray-300 px-3',
                            error && 'border-red-500'
                        )}
                    >
                        <TextInput
                            className="flex-1 text-base text-black "
                            value={value}
                            onChangeText={onChange}
                            placeholder={placeholder}
                            keyboardType={keyboardType}
                            secureTextEntry={isSecure}
                            placeholderTextColor="#9ca3af"
                        />

                        {secureTextEntry && (
                            <Pressable onPress={() => setIsSecure(!isSecure)}>
                                <Ionicons
                                    name={isSecure ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#6b7280"
                                />
                            </Pressable>
                        )}
                    </View>

                    {error?.message && (
                        <Text className="mt-1 text-sm text-red-500">{error.message}</Text>
                    )}

                    {!error?.message && detail && (
                        <Text className="mt-1 text-xs text-gray-500">{detail}</Text>
                    )}
                </View>
            )}
        />
    );
}
