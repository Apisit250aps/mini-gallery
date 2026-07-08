'use client';

import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BaseFieldProps } from './input';

export type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
};

export const SelectField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  placeholder,
  options,
  className,
  disabled,
}: SelectFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
          {(label || labelAccessory) && (
            <div className="flex w-full items-center justify-between">
              {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
              {labelAccessory}
            </div>
          )}
          <Select
            value={field.value ?? undefined}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger id={id}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
