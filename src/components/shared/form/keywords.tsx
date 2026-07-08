'use client';

import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { BaseFieldProps } from './input';

export type KeywordsFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const KeywordsField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  placeholder,
  className,
  disabled,
}: KeywordsFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => {
        const valueAsString = Array.isArray(field.value)
          ? field.value.join(', ')
          : '';
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          const keywords = val
            .split(',')
            .map((k) => k.trim())
            .filter((k) => k.length > 0);
          field.onChange(keywords);
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {(label || labelAccessory) && (
              <div className="flex w-full items-center justify-between">
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {labelAccessory}
              </div>
            )}
            <Input
              id={id}
              value={valueAsString}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
