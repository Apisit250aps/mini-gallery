'use client';

import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BaseFieldProps } from './input';

export type RadioGroupFieldOption = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
};

export type RadioGroupFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: RadioGroupFieldOption[];
  className?: string;
  disabled?: boolean;
};

export const RadioGroupField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  rules,
  options,
  className,
  disabled,
}: RadioGroupFieldProps<T>): React.ReactElement => {
  const legendId = `form-legend-${name}`;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => (
        <FieldSet className={className}>
          {label && (
            <FieldLegend id={legendId} variant="label">
              {label}
            </FieldLegend>
          )}
          <RadioGroup
            value={field.value ?? ''}
            onValueChange={field.onChange}
            disabled={disabled}
            aria-labelledby={label ? legendId : undefined}
            data-invalid={fieldState.invalid}
          >
            <div className="flex flex-col gap-2.5">
              {options.map((opt) => {
                const optionId = `form-rhf-${name}-${opt.value}`;
                return (
                  <div key={opt.value} className="flex items-start gap-2">
                    <RadioGroupItem value={opt.value} id={optionId} />
                    <div className="grid gap-1 leading-none">
                      <FieldLabel
                        htmlFor={optionId}
                        className="cursor-pointer font-normal text-sm"
                      >
                        {opt.label}
                      </FieldLabel>
                      {opt.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {opt.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
};
