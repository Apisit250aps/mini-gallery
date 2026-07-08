'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { BaseFieldProps } from './input';

export type TagsInputFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const TagsInputField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  placeholder = 'เพิ่ม tag...',
  className,
  disabled,
}: TagsInputFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`;
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => {
        const tags: string[] = Array.isArray(field.value) ? field.value : [];

        const addTag = (tag: string) => {
          const trimmed = tag.trim();
          if (trimmed && !tags.includes(trimmed)) {
            const nextTags = [...tags, trimmed];
            field.onChange(nextTags);
          }
          setInputValue('');
        };

        const removeTag = (indexToRemove: number) => {
          const nextTags = tags.filter((_, index) => index !== indexToRemove);
          field.onChange(nextTags);
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
          } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            e.preventDefault();
            removeTag(tags.length - 1);
          }
        };

        const handleBlur = () => {
          if (inputValue) {
            addTag(inputValue);
          }
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {(label || labelAccessory) && (
              <div className="flex w-full items-center justify-between">
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {labelAccessory}
              </div>
            )}
            <div
              className={cn(
                'flex flex-wrap gap-1.5 items-center w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-ring min-h-9',
                disabled && 'cursor-not-allowed opacity-50 bg-muted/20',
                fieldState.invalid && 'border-destructive focus-within:ring-destructive focus-within:border-destructive'
              )}
              onClick={() => inputRef.current?.focus()}
            >
              {tags.map((tag, index) => (
                <Badge
                  key={`${tag}-${index}`}
                  variant="secondary"
                  className="flex items-center gap-1 py-0.5 pl-2 pr-1 h-6 text-xs select-none"
                >
                  <span>{tag}</span>
                  {!disabled && (
                    <button
                      type="button"
                      className="rounded-full outline-hidden hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(index);
                      }}
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </Badge>
              ))}
              <input
                ref={inputRef}
                id={id}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={tags.length === 0 ? placeholder : ''}
                disabled={disabled}
                className="flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground min-w-[80px]"
                aria-invalid={fieldState.invalid}
              />
            </div>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
