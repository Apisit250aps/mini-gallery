'use client';

import React, { useState } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { BaseFieldProps } from './input';

export type ComboboxFieldOption = {
  value: string;
  label: string;
};

export type ComboboxFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: ComboboxFieldOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
};

export const ComboboxField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  multiple = false,
  className,
  disabled,
}: ComboboxFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => {
        const val = field.value;

        const selectedValues: string[] = multiple
          ? Array.isArray(val)
            ? val
            : []
          : val
            ? [val]
            : [];

        const handleSelect = (optionValue: string) => {
          if (multiple) {
            const nextValues = selectedValues.includes(optionValue)
              ? selectedValues.filter((v) => v !== optionValue)
              : [...selectedValues, optionValue];
            field.onChange(nextValues);
          } else {
            const nextValue = selectedValues.includes(optionValue)
              ? null
              : optionValue;
            field.onChange(nextValue);
            setOpen(false);
          }
        };

        const handleRemove = (e: React.MouseEvent, optionValue: string) => {
          e.stopPropagation();
          e.preventDefault();
          const nextValues = selectedValues.filter((v) => v !== optionValue);
          field.onChange(nextValues);
        };

        const selectedOptions = options.filter((opt) =>
          selectedValues.includes(opt.value),
        );

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
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      'w-full justify-between font-normal min-h-9 h-auto py-1.5 px-3 flex flex-wrap gap-1',
                      selectedValues.length === 0 && 'text-muted-foreground',
                    )}
                    disabled={disabled}
                    aria-invalid={fieldState.invalid}
                  />
                }
                id={id}
              >
                <div className="flex flex-wrap gap-1 items-center grow text-left">
                  {selectedOptions.length > 0
                    ? multiple
                      ? selectedOptions.map((opt) => (
                          <Badge
                            key={opt.value}
                            variant="secondary"
                            className="flex items-center gap-1 py-0.5 pl-2 pr-1 h-6 text-xs"
                          >
                            {opt.label}
                            {!disabled && (
                              <button
                                type="button"
                                className="rounded-full outline-hidden hover:bg-muted-foreground/20 p-0.5"
                                onClick={(e) => handleRemove(e, opt.value)}
                              >
                                <X className="size-3" />
                              </button>
                            )}
                          </Badge>
                        ))
                      : selectedOptions[0].label
                    : placeholder || 'Select option...'}
                </div>
                <ChevronsUpDown className="size-4 shrink-0 opacity-50 ml-auto" />
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder || 'Search...'}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {emptyMessage || 'No results found.'}
                    </CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => {
                        const isSelected = selectedValues.includes(opt.value);
                        return (
                          <CommandItem
                            key={opt.value}
                            value={opt.label}
                            data-checked={isSelected}
                            onSelect={() => handleSelect(opt.value)}
                          >
                            {opt.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
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
