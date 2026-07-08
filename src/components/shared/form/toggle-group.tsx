'use client';

import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BaseFieldProps } from './input';

export type ToggleGroupFieldOption = {
  value: string;
  label: React.ReactNode;
};

export type ToggleGroupFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: ToggleGroupFieldOption[];
  multiple?: boolean;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
};

export const ToggleGroupField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  options,
  multiple = false,
  variant,
  size,
  className,
  disabled,
}: ToggleGroupFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => {
        const val = field.value;
        const toggleValue = multiple
          ? Array.isArray(val)
            ? val
            : []
          : val
            ? [val]
            : [];

        const handleValueChange = (newValue: string[]) => {
          field.onChange(multiple ? newValue : newValue[0] || null);
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {(label || labelAccessory) && (
              <div className="flex w-full items-center justify-between">
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {labelAccessory}
              </div>
            )}
            <ToggleGroup
              value={toggleValue}
              onValueChange={handleValueChange}
              multiple={multiple}
              variant={variant}
              size={size}
              disabled={disabled}
              id={id}
            >
              {options.map((opt) => (
                <ToggleGroupItem key={opt.value} value={opt.value}>
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
