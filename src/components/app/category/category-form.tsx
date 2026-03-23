'use client'
import { useForm } from '@tanstack/react-form'
import { CategoryEntity } from '@/core/entities/category.entity'
import React from 'react'
import { Card } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const formSchema = CategoryEntity.pick({
  name: true,
})

export default function CategoryForm() {
  const form = useForm({
    onSubmit: (values) => {
      console.log(values)
    },
    validators: {
      onSubmit: formSchema,
    },
    defaultValues: {
      name: '',
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
    </form>
  )
}
