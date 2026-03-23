'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'

export type GalleryInputValue = File | string

type GalleryPreview = {
  src: string
  label: string
  kind: 'file' | 'url'
}

type ProjectImageInputProps = {
  value: GalleryInputValue[]
  onChange: (next: GalleryInputValue[]) => void
  disabled?: boolean
}

const reorder = <T,>(items: T[], from: number, to: number) => {
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export default function ProjectImageInput({
  value,
  onChange,
  disabled = false,
}: ProjectImageInputProps) {
  const [urlInput, setUrlInput] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const previews = useMemo<GalleryPreview[]>(() => {
    return value.map((item) => {
      if (typeof item === 'string') {
        return {
          src: item,
          label: item,
          kind: 'url',
        }
      }

      return {
        src: URL.createObjectURL(item),
        label: item.name,
        kind: 'file',
      }
    })
  }, [value])

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.kind === 'file') {
          URL.revokeObjectURL(preview.src)
        }
      })
    }
  }, [previews])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    onChange([...value, ...files])
    e.target.value = ''
  }

  const handleAddUrl = () => {
    const nextUrl = urlInput.trim()
    if (!nextUrl) return

    onChange([...value, nextUrl])
    setUrlInput('')
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, currentIndex) => currentIndex !== index))
  }

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null)
      setDropIndex(null)
      return
    }

    onChange(reorder(value, dragIndex, targetIndex))
    setDragIndex(null)
    setDropIndex(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 md:flex-row">
        <Input
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={handleFileChange}
        />
      </div>

      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste image URL"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddUrl()
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleAddUrl}
          disabled={disabled}
        >
          Add URL
        </Button>
      </div>

      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {previews.map((preview, index) => {
            const isDropTarget = dropIndex === index && dragIndex !== null

            return (
              <div
                key={`${preview.kind}-${preview.label}-${index}`}
                className={cn(
                  'overflow-hidden rounded-md border bg-muted/20',
                  isDropTarget && 'ring-2 ring-primary',
                )}
                draggable={!disabled}
                onDragStart={() => setDragIndex(index)}
                onDragEnter={(e) => {
                  e.preventDefault()
                  if (dragIndex !== null && dragIndex !== index) {
                    setDropIndex(index)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(index)
                }}
                onDragEnd={() => {
                  setDragIndex(null)
                  setDropIndex(null)
                }}
              >
                <div className="aspect-video w-full bg-muted">
                  <Image
                    src={preview.src}
                    alt={preview.label}
                    width={640}
                    height={360}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2 p-2">
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {preview.kind === 'file' ? 'File' : 'URL'} • {preview.label}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">#{index + 1}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      disabled={disabled}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          No images yet. Upload files or add image URLs.
        </div>
      )}
    </div>
  )
}
