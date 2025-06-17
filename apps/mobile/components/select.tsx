import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

type Option = {
    label: string;
    value: string | number;
};

type Props<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    detail?: string;
    require?: boolean;
    rules?: any;
    className?: string;
    options: Option[];
    placeholder?: string;
    multiple?: boolean;
    maxItems?: number;
};

export function BaseSelectInput<T extends FieldValues>({
    name,
    control,
    label,
    detail,
    require = false,
    rules,
    className,
    options,
    placeholder = 'ເລືອກ',
    multiple = false,
    maxItems = 5,
}: Readonly<Props<T>>) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(options);

    return (
        <View
            className={`relative mb-4 ${className ?? ''}`}
            style={{ zIndex: open ? 1000 : 0 }}
        >
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <View>
                        {label && (
                            <View className="flex-row items-center">
                                <Text className="ml-2 mb-1 text-sm font-medium text-gray-700">{label}</Text>
                                {require && <Text className="ml-1 text-red-500">*</Text>}
                            </View>
                        )}

                        {multiple ? (
                            <DropDownPicker
                                multiple={true}
                                min={0}
                                max={maxItems}
                                open={open}
                                value={value || []}
                                items={items}
                                setOpen={setOpen}
                                setValue={onChange}
                                setItems={setItems}
                                placeholder={placeholder}
                                mode="BADGE"
                                badgeDotColors={['#557FFA']}
                                style={{
                                    borderColor: error ? 'red' : '#ccc',
                                    borderRadius: 8,
                                }}
                                dropDownContainerStyle={{
                                    borderColor: error ? 'red' : '#ccc',
                                    borderRadius: 8,
                                    zIndex: 1100,
                                }}
                                dropDownDirection="AUTO"
                                disableBorderRadius={true}
                                modalProps={{
                                    animationType: 'slide',
                                    transparent: true,
                                }}

                            />
                        ) : (
                            <DropDownPicker
                                open={open}
                                value={value || null}
                                items={items}
                                setOpen={setOpen}
                                setValue={onChange}
                                setItems={setItems}
                                placeholder={placeholder}
                                style={{
                                    borderColor: error ? 'red' : '#ccc',
                                    borderRadius: 8,
                                }}
                                dropDownContainerStyle={{
                                    borderColor: error ? 'red' : '#ccc',
                                    borderRadius: 8,
                                    zIndex: 1100,
                                }}
                                dropDownDirection="AUTO"
                                disableBorderRadius={true}
                                modalProps={{
                                    animationType: 'slide',
                                    transparent: true,
                                }}

                            />
                        )}

                        {error?.message && (
                            <Text className="mt-1 text-sm text-red-500">{error.message}</Text>
                        )}

                        {!error?.message && detail && (
                            <Text className="mt-1 text-xs text-gray-500">{detail}</Text>
                        )}
                    </View>
                )}
            />
        </View>
    );
}
