'use client';

import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import MarkdownEditor from '@/components/markdown-editor';
import { BaseFieldProps } from './input';

export type MarkdownFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  className?: string;
  disabled?: boolean;
};

export const MarkdownField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  className,
}: MarkdownFieldProps<T>): React.ReactElement => {
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
          <MarkdownEditor
            value={field.value || ''}
            onChange={(val) => field.onChange(val || '')}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
