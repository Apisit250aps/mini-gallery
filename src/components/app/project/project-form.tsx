'use client'
import React, { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import z from 'zod'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjectQueries } from '@/hooks/queries/project-query'
import ProjectImageInput, {
  GalleryInputValue,
} from '@/components/app/project/project-image-input'
import ProjectTagsInput from '@/components/app/project/project-tags-input'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  category: z.string().uuid('Category is required'),
  location: z.string(),
  type: z.string(),
  program: z.string(),
  client: z.string(),
  siteArea: z.string(),
  builtArea: z.string(),
  design: z.string(),
  completion: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  galleries: z.array(z.union([z.string(), z.instanceof(File)])),
})

const normalizeOptional = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export type ProjectFormValue = {
  title: string
  category: string
  location?: string
  type?: string
  program?: string
  client?: string
  siteArea?: string
  builtArea?: string
  design?: string
  completion?: string
  description?: string
  tags: string[]
  galleries: GalleryInputValue[]
}

export default function ProjectForm({
  value,
  isLoading = false,
  onSubmit,
}: FormProps<ProjectFormValue>) {
  const { categories } = useProjectQueries()
  const [isUploading, setIsUploading] = useState(false)
  const isMutating = isLoading || isUploading
  const form = useForm({
    onSubmit: async ({ value }) => {
      const galleryUrls: string[] = []
      try {
        setIsUploading(true)
        for (const item of value.galleries) {
          if (typeof item === 'string') {
            galleryUrls.push(item)
            continue
          }

          const formData = new FormData()
          formData.append('folder', value.title || 'projects')
          formData.append('file', item)

          const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          })

          const payload = (await response.json()) as ApiResponse<UploadResult>
          if (!response.ok || !payload.success) {
            throw new Error(payload.error || payload.message || 'Upload failed')
          }

          const uploadedUrl =
            payload.data?.webp?.url || payload.data?.original?.url

          if (!uploadedUrl) {
            throw new Error('Uploaded image URL is missing')
          }

          galleryUrls.push(uploadedUrl)
        }

        onSubmit({
          title: value.title,
          category: value.category,
          location: normalizeOptional(value.location),
          type: normalizeOptional(value.type),
          program: normalizeOptional(value.program),
          client: normalizeOptional(value.client),
          siteArea: normalizeOptional(value.siteArea),
          builtArea: normalizeOptional(value.builtArea),
          design: normalizeOptional(value.design),
          completion: normalizeOptional(value.completion),
          description: normalizeOptional(value.description),
          tags: value.tags,
          galleries: galleryUrls,
        })
      } catch (error) {
        toast.error((error as Error).message || 'Image upload failed')
      } finally {
        setIsUploading(false)
      }
    },
    validators: {
      onSubmit: formSchema,
    },
    defaultValues: {
      title: value?.title || '',
      category: value?.category || '',
      location: value?.location || '',
      type: value?.type || '',
      program: value?.program || '',
      client: value?.client || '',
      siteArea: value?.siteArea || '',
      builtArea: value?.builtArea || '',
      design: value?.design || '',
      completion: value?.completion || '',
      description: value?.description || '',
      tags: value?.tags || [],
      galleries: value?.galleries || [],
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="gap-4"
    >
      <FieldGroup className="gap-4">
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid && field.state.meta.isTouched
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Project Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter project title"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="category">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid && field.state.meta.isTouched
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Category ID</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.data?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="location">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Location</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter location"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="type">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Type</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter type"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="program">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Program</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter program"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="client">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Client</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter client"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="siteArea">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Site Area</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter site area"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="builtArea">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Built Area</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter built area"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="design">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Design</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter design"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="completion">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Completion</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter completion"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter description"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="tags">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
              <ProjectTagsInput
                value={field.state.value}
                onChange={field.handleChange}
                disabled={isMutating}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="galleries">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Galleries</FieldLabel>
              <ProjectImageInput
                value={field.state.value}
                onChange={field.handleChange}
                disabled={isMutating}
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isMutating}>
          {isMutating ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </form>
  )
}
