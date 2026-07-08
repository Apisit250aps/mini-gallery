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
import { Checkbox } from '@/components/ui/checkbox';
import { BaseFieldProps } from './input';

export type CheckboxFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  className?: string;
  disabled?: boolean;
};

export const CheckboxField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  rules,
  className,
  disabled,
}: CheckboxFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field
          className={cn(
            'flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-xs',
            className,
          )}
          data-invalid={fieldState.invalid}
        >
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            id={id}
          />
          <div className="space-y-1 leading-none">
            {label && (
              <FieldLabel htmlFor={id} className="cursor-pointer">
                {label}
              </FieldLabel>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        </Field>
      )}
    />
  );
};
