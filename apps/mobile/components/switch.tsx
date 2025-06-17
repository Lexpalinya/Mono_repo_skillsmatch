// components/BaseSwitchInput.tsx
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Switch, Text, View } from 'react-native';
import { cn } from '../utils/utils';

type Props<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    detail?: string;
    require?: boolean;
    control: Control<T>;
    rules?: any;
    className?: string;
};

export function BaseSwitchInput<T extends FieldValues>({
    name,
    label,
    detail,
    require = false,
    control,
    rules,
    className,
}: Readonly<Props<T>>) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View className={cn('flex flex-row w-full mb-6 rounded-md border border-gray-300 justify-between px-2 py-2', className)}>
                    <View className='w-5/6'>

                        {label && (
                            <View className='flex-row '>

                                <Text className=" text-sm font-medium text-gray-700">{label}</Text>
                                {require && <Text className='ml-2 text-red-500'>*</Text>}
                            </View>
                        )}

                        {detail && (
                            <Text className="mt-1 text-xs text-gray-500">{detail}</Text>
                        )}
                    </View>

                    <View className={cn('flex-row items-center justify-between', error ? 'border border-red-500 rounded-md  py-2' : '')}>
                        <Switch
                            value={!!value}
                            onValueChange={onChange}
                            trackColor={{ false: '#D9D9D9', true: '#557FFA' }}
                            thumbColor={value ? '#fff' : '#f4f3f4'}

                        />

                    </View>

                    {error?.message && (
                        <Text className="mt-1 text-sm text-red-500">{error.message}</Text>
                    )}
                </View>
            )}
        />
    );
}
