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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { BaseFieldProps } from './input';

export type InputOTPFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  maxLength?: number;
  className?: string;
  disabled?: boolean;
};

export const InputOTPField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  maxLength = 6,
  className,
  disabled,
}: InputOTPFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => {
        const renderSlots = (start: number, end: number) => {
          return Array.from({ length: end - start }, (_, i) => {
            const index = start + i;
            return <InputOTPSlot key={index} index={index} />;
          });
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {(label || labelAccessory) && (
              <div className="flex w-full items-center justify-between">
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {labelAccessory}
              </div>
            )}
            <InputOTP
              id={id}
              value={field.value ?? ''}
              onChange={field.onChange}
              maxLength={maxLength}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            >
              {maxLength === 6 ? (
                <div className="flex items-center gap-2">
                  <InputOTPGroup>{renderSlots(0, 3)}</InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>{renderSlots(3, 6)}</InputOTPGroup>
                </div>
              ) : (
                <InputOTPGroup>{renderSlots(0, maxLength)}</InputOTPGroup>
              )}
            </InputOTP>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
