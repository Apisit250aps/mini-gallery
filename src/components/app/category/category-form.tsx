'use client'
import React from 'react'
//
import { useForm } from '@tanstack/react-form'
import { CategoryEntity } from '@/core/entities/category.entity'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Category } from '@/core/repositories/category.repo'

const formSchema = CategoryEntity.pick({
  name: true,
})

export default function CategoryForm({
  value,
  isLoading = false,
  onSubmit,
}: FormProps<Pick<Category, 'name'>>) {
  const form = useForm({
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
    validators: {
      onSubmit: formSchema,
    },
    defaultValues: {
      name: value?.name || '',
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
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid && field.state.meta.isTouched
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter category name"
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
          {isLoading ? 'Creating...' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}
