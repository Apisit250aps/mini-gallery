'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { X, Upload, Link as LinkIcon } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { BaseFieldProps } from './input'

export type ImageUploadFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  className?: string
  disabled?: boolean
  maxFiles?: number
}

// Generates or retrieves a stable unique ID for a string or File object
const getItemId = (item: string | File): string => {
  if (typeof item === 'string') {
    return item
  }
  const file = item as unknown as File & { id?: string }
  if (!file.id) {
    file.id = `file-${file.name}-${file.size}-${file.lastModified}-${Math.random()}`
  }
  return file.id
}

// Sortable Image Preview Item Component
const SortableImageItem = ({
  item,
  id,
  onRemove,
  disabled,
}: {
  item: string | File
  id: string
  onRemove: () => void
  disabled?: boolean
}) => {
  const [url, setUrl] = useState<string>('')

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  useEffect(() => {
    if (typeof item === 'string') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(item)
      return
    }
    const objectUrl = URL.createObjectURL(item)
    setUrl(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [item])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  }

  if (!url) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group size-28 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center select-none shadow-xs transition-shadow hover:shadow-md touch-none',
        !disabled && 'cursor-grab active:cursor-grabbing',
      )}
      {...attributes}
      {...listeners}
    >
      <img
        src={url}
        alt="Preview"
        className="size-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        {!disabled && (
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
            title="ลบรูปภาพ"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export const ImageUploadField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  rules,
  className,
  disabled,
  maxFiles = 10,
}: ImageUploadFieldProps<T>): React.ReactElement => {
  const id = `form-rhf-${name}`
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Setup sensors for DndKit reordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Triggers drag only after moving 8px, allowing clicks on the delete button
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field, fieldState }) => {
        const value: (string | File)[] = Array.isArray(field.value)
          ? field.value
          : []

        const handleFilesChange = (filesList: FileList | null) => {
          if (filesList) {
            const filesArray = Array.from(filesList)
            const nextValue = [...value, ...filesArray].slice(0, maxFiles)
            field.onChange(nextValue)
          }
        }

        const handleAddUrl = () => {
          const trimmedUrl = urlInput.trim()
          if (trimmedUrl) {
            const nextValue = [...value, trimmedUrl].slice(0, maxFiles)
            field.onChange(nextValue)
            setUrlInput('')
            setShowUrlInput(false)
          }
        }

        const handleRemove = (indexToRemove: number) => {
          const nextValue = value.filter((_, index) => index !== indexToRemove)
          field.onChange(nextValue)
        }

        // Handle reorder drag end
        const handleDragEnd = (event: DragEndEvent) => {
          const { active, over } = event
          if (over && active.id !== over.id) {
            const activeId = active.id as string
            const overId = over.id as string

            const oldIndex = value.findIndex(
              (item) => getItemId(item) === activeId,
            )
            const newIndex = value.findIndex(
              (item) => getItemId(item) === overId,
            )

            if (oldIndex !== -1 && newIndex !== -1) {
              const newValue = arrayMove(value, oldIndex, newIndex)
              field.onChange(newValue)
            }
          }
        }

        // Drag & Drop Area Events
        const handleDragOverArea = (e: React.DragEvent) => {
          e.preventDefault()
          if (!disabled && value.length < maxFiles) {
            setIsDragOver(true)
          }
        }

        const handleDragLeaveArea = (e: React.DragEvent) => {
          e.preventDefault()
          setIsDragOver(false)
        }

        const handleDropArea = (e: React.DragEvent) => {
          e.preventDefault()
          setIsDragOver(false)
          if (!disabled && value.length < maxFiles) {
            handleFilesChange(e.dataTransfer.files)
          }
        }

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {(label || labelAccessory) && (
              <div className="flex w-full items-center justify-between">
                {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
                {labelAccessory}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {/* Sortable Grid of Previews */}
              {value.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={value.map(getItemId)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="flex flex-wrap gap-2.5">
                      {value.map((item, index) => {
                        const itemId = getItemId(item)
                        return (
                          <SortableImageItem
                            key={itemId}
                            id={itemId}
                            item={item}
                            onRemove={() => handleRemove(index)}
                            disabled={disabled}
                          />
                        )
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {/* Drag and Drop Zone Container */}
              {value.length < maxFiles && !disabled && (
                <div className="flex flex-col gap-2">
                  <div
                    onDragOver={handleDragOverArea}
                    onDragLeave={handleDragLeaveArea}
                    onDrop={handleDropArea}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'flex flex-col items-center justify-center border-2 border-dashed border-input rounded-lg p-6 bg-transparent text-center cursor-pointer transition-colors duration-200 min-h-[120px]',
                      isDragOver && 'border-primary bg-primary/5',
                      fieldState.invalid && 'border-destructive',
                    )}
                  >
                    <Upload className="size-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">
                      ลากไฟล์รูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      (สูงสุด {maxFiles} รูป)
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFilesChange(e.target.files)}
                    className="hidden"
                  />

                  {/* Add URL Area */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="cursor-pointer self-start"
                    >
                      <LinkIcon data-icon="inline-start" />
                      ใส่ URL รูปภาพ
                    </Button>

                    {showUrlInput && (
                      <div className="flex gap-2 max-w-md items-center mt-1">
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="h-8"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddUrl}
                          className="h-8 cursor-pointer"
                        >
                          เพิ่ม
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
