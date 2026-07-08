'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Loader2 } from 'lucide-react'
import {
  createProjectSchema,
  type CreateProjectInput,
  type ProjectEntity,
} from '@/domains/schemas/project'
import { Button } from '@/components/ui/button'
import {
  InputField,
  TextareaField,
  SwitchField,
  TagsInputField,
  ImageUploadField,
} from '@/components/shared/form'

// Form schema that matches createProjectSchema but omits creator and accepts Files for images
const formSchema = createProjectSchema.omit({ creator: true }).extend({
  images: z
    .array(
      z.union([
        z.string(),
        z.custom<File>(
          (val) => typeof window !== 'undefined' && val instanceof File,
        ),
      ]),
    )
    .optional()
    .default([])
    .unwrap(),
})

type FormValues = z.infer<typeof formSchema>

interface ProjectFormProps {
  defaultValues?: Partial<ProjectEntity>
  onSubmit: (data: Omit<CreateProjectInput, 'creator'>) => void
  isLoading?: boolean
  submitLabel?: string
}

// Utility to upload File to /api/upload and return GCS URL
const uploadFile = async (file: File, slug: string): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`/api/upload?slug=${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(
      errorData.message || `Upload failed with status ${res.status}`,
    )
  }

  const result = await res.json()
  return result.data.url
}

// Helper defined outside of the component to keep try/catch out of the React component context, complying with React Compiler guidelines.
const submitProjectForm = async (
  values: FormValues,
  onSubmit: (data: Omit<CreateProjectInput, 'creator'>) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true)
  try {
    // Upload all selected local Files to GCS before submitting the form, organized by slug folder
    const slug = values.slug || 'default'
    const imagesArray = values.images ?? []
    const convertedImages = await Promise.all(
      imagesArray.map(async (img) => {
        if (typeof img === 'string') return img
        return await uploadFile(img, slug)
      }),
    )

    // Submit resolved data matching the schema
    onSubmit({
      ...values,
      images: convertedImages,
    })
  } catch (err) {
    console.error('Error uploading images:', err)
  } finally {
    setLoading(false)
  }
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  isLoading: externalLoading,
  submitLabel = 'บันทึก',
}: ProjectFormProps) {
  const [internalLoading, setInternalLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      slug: defaultValues?.slug ?? '',
      tags: defaultValues?.tags ?? [],
      description: defaultValues?.description ?? null,
      details: defaultValues?.details ?? '',
      isActive: defaultValues?.isActive ?? true,
      images: defaultValues?.images ?? [],
    },
  })

  const nameValue = useWatch({
    control: form.control,
    name: 'name',
  })

  useEffect(() => {
    if (!defaultValues) {
      const slug = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
      form.setValue('slug', slug, { shouldValidate: false })
    }
  }, [nameValue, defaultValues, form])

  const handleFormSubmit = (values: FormValues) => {
    submitProjectForm(values, onSubmit, setInternalLoading)
  }

  const isLoading = externalLoading || internalLoading

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit, (err) =>
        console.error('Form validation errors:', err),
      )}
      className="flex flex-col gap-4 py-2"
      noValidate
    >
      <InputField
        control={form.control}
        name="name"
        label="ชื่อ Project"
        placeholder="My Awesome Project"
      />

      <InputField
        control={form.control}
        name="slug"
        label="Slug"
        placeholder="my-awesome-project"
        description="URL-friendly identifier (ตัวพิมพ์เล็ก, ขีดกลาง)"
        disabled={!!defaultValues}
      />
      <InputField
        control={form.control}
        name="description"
        label="คำอธิบาย"
        placeholder="รายละเอียดของ project..."
      />

      <TextareaField
        control={form.control}
        name="details"
        label="รายละเอียด"
        placeholder="รายละเอียดของ project..."
        description="รายละเอียดเพิ่มเติมเกี่ยวกับ project"
      />

      <TagsInputField
        control={form.control}
        name="tags"
        label="Tags"
        description="กด Enter หรือ , เพื่อเพิ่ม tag"
      />

      <ImageUploadField
        control={form.control}
        name="images"
        label="รูปภาพ"
        description="เลือกอัพโหลดไฟล์รูปภาพหรือระบุ URL รูปภาพ"
      />

      <SwitchField
        control={form.control}
        name="isActive"
        label="เปิดใช้งาน"
        description="แสดง project บนหน้าเว็บ"
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading} id="project-form-submit">
          {isLoading && (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          )}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
