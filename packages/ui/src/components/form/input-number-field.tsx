"use client";

import React from "react";
import { InputNumber, InputNumberProps } from "../ui/input-number";

export const InputNumberField = (props: InputNumberProps) => {
  return <InputNumber {...props} />;
};

InputNumberField.displayName = "InputNumberField";
