'use client';

import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { BaseFieldProps } from './input';

export type TextareaFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<React.ComponentProps<'textarea'>, 'name' | 'defaultValue'>;

export const TextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  id: customId,
  onChange: customOnChange,
  ...props
}: TextareaFieldProps<T>): React.ReactElement => {
  const id = customId || `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {(label || labelAccessory) && (
            <div className="flex w-full items-center justify-between">
              {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
              {labelAccessory}
            </div>
          )}
          <Textarea
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            {...props}
            value={field.value ?? ''}
            onChange={(e) => {
              field.onChange(e);
              customOnChange?.(e);
            }}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
