'use client'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import React, { useMemo, useState } from 'react'

type ProjectTagsInputProps = {
  value: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
}

const normalizeTag = (tag: string) => tag.trim()

export default function ProjectTagsInput({
  value,
  onChange,
  disabled = false,
}: ProjectTagsInputProps) {
  const [draft, setDraft] = useState('')

  const lowerCaseSet = useMemo(
    () => new Set(value.map((tag) => tag.toLowerCase())),
    [value],
  )

  const addTag = () => {
    const nextTag = normalizeTag(draft)
    if (!nextTag) return

    if (lowerCaseSet.has(nextTag.toLowerCase())) {
      setDraft('')
      return
    }

    onChange([...value, nextTag])
    setDraft('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((currentTag) => currentTag !== tag))
  }

  return (
    <div className="space-y-2">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
          }

          if (
            e.key === 'Backspace' &&
            draft.length === 0 &&
            value.length > 0 &&
            !disabled
          ) {
            onChange(value.slice(0, -1))
          }
        }}
        placeholder="Type a tag and press Enter"
        disabled={disabled}
      />

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="h-7 gap-1.5 px-3">
              <span>{tag}</span>
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                className={cn(
                  'rounded-full px-1 text-xs leading-none hover:bg-muted/80',
                  disabled && 'pointer-events-none opacity-40',
                )}
                onClick={() => removeTag(tag)}
                disabled={disabled}
              >
                x
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No tags yet.</p>
      )}
    </div>
  )
}
