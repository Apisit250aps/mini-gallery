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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjectQueries } from '@/hooks/queries/project-query'

const formSchema = ProjectEntity.pick({
  title: true,
  category: true,
  tags: true,
  galleries: true,
})

type ProjectFormValue = Pick<
  Project,
  'title' | 'category' | 'tags' | 'galleries'
>

export default function ProjectForm({
  value,
  isLoading = false,
  onSubmit,
}: FormProps<ProjectFormValue>) {
  const { categories } = useProjectQueries()
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
      </FieldGroup>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </form>
  )
}
