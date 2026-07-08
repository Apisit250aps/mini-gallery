'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type MarkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
};

/**
 * Simple markdown editor component backed by a Textarea.
 * Replace with a rich markdown editor (e.g. @uiw/react-md-editor) if needed.
 */
const MarkdownEditor = ({
  value,
  onChange,
  placeholder = 'Write markdown here...',
  disabled,
  className,
  rows = 8,
}: MarkdownEditorProps) => {
  return (
    <Textarea
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={cn('font-mono text-sm resize-y', className)}
    />
  );
};

export default MarkdownEditor;
