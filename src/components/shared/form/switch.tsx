'use client';

import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { BaseFieldProps } from './input';

export type SwitchFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'default';
};

export const SwitchField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  rules,
  className,
  disabled,
  size,
}: SwitchFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field
          className={cn(
            'flex flex-row items-center justify-between rounded-lg border p-4 shadow-xs',
            className,
          )}
          data-invalid={fieldState.invalid}
        >
          <div className="space-y-0.5">
            {label && (
              <FieldLabel htmlFor={id} className="cursor-pointer">
                {label}
              </FieldLabel>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
          <Switch
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            size={size}
            id={id}
          />
        </Field>
      )}
    />
  );
};
