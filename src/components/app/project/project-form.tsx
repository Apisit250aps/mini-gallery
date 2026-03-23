'use client'
import React from 'react'
import { useForm } from '@tanstack/react-form'
import { ProjectEntity } from '@/core/entities/project.entity'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Project } from '@/core/repositories/project.repo'

const formSchema = ProjectEntity.pick({
  title: true,
  category: true,
  displayOrder: true,
  tags: true,
  galleries: true,
})

type ProjectFormValue = Pick<
  Project,
  'title' | 'category' | 'displayOrder' | 'tags' | 'galleries'
>

export default function ProjectForm({
  value,
  isLoading = false,
  onSubmit,
}: FormProps<ProjectFormValue>) {
  const form = useForm({
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
    validators: {
      onSubmit: formSchema,
    },
    defaultValues: {
      title: value?.title || '',
      category: value?.category || '',
      displayOrder: value?.displayOrder || 1,
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
    >
      <FieldGroup>
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
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter category id"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="displayOrder">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid && field.state.meta.isTouched
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Display Order</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={1}
                  value={String(field.state.value)}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                  placeholder="Enter display order"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </form>
  )
}
