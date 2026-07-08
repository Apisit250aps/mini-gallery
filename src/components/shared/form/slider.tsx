'use client';

import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';
import { BaseFieldProps } from './input';

export type SliderFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
};

export const SliderField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  min = 0,
  max = 100,
  step,
  className,
  disabled,
}: SliderFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => {
        const val = field.value;
        const isArray = Array.isArray(val);
        const sliderValue = isArray ? val : [val ?? min];

        const handleValueChange = (newValue: number | readonly number[]) => {
          const arr = Array.isArray(newValue)
            ? Array.from(newValue)
            : [newValue as number];
          field.onChange(isArray ? arr : arr[0]);
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {(label || labelAccessory) && (
              <div className="flex w-full items-center justify-between">
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {labelAccessory}
              </div>
            )}
            <Slider
              value={sliderValue}
              onValueChange={handleValueChange}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              id={id}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
