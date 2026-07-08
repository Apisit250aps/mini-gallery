'use client';

import React, { useState } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BaseFieldProps } from './input';

export type DatePickerFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const DatePickerField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  placeholder,
  className,
  disabled,
}: DatePickerFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => {
        const selectedDate = field.value ? new Date(field.value) : undefined;

        const handleSelect = (date: Date | undefined) => {
          field.onChange(date ? date.toISOString() : null);
          setOpen(false);
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {(label || labelAccessory) && (
              <div className="flex w-full items-center justify-between">
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {labelAccessory}
              </div>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-9',
                      !selectedDate && 'text-muted-foreground',
                    )}
                    disabled={disabled}
                    aria-invalid={fieldState.invalid}
                  />
                }
                id={id}
              >
                <CalendarIcon data-icon="inline-start" />
                {selectedDate
                  ? format(selectedDate, 'PPP')
                  : placeholder || 'Pick a date'}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelect}
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
