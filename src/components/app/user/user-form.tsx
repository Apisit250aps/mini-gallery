'use client'
import React from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User } from '@/core/repositories/user.repo'
import { Checkbox } from '@/components/ui/checkbox'
import z from 'zod'

const createSchema = z
  .object({
    name: z.string().trim().min(1),
    password: z.union([z.string(), z.undefined()]),
    isAdmin: z.boolean(),
    isActive: z.boolean(),
  })
  .superRefine((data, context) => {
    if (!data.password?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Password is required',
      })
    }
  })

const updateSchema = z.object({
  name: z.string().trim().min(1),
  password: z.union([z.string(), z.undefined()]),
  isAdmin: z.boolean(),
  isActive: z.boolean(),
})

type UserFormValue = Pick<User, 'name' | 'isAdmin' | 'isActive'> & {
  password?: string
}

export default function UserForm({
  value,
  isLoading = false,
  onSubmit,
  requirePassword = false,
}: FormProps<UserFormValue> & { requirePassword?: boolean }) {
  const form = useForm({
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
    validators: {
      onSubmit: requirePassword ? createSchema : updateSchema,
    },
    defaultValues: {
      name: value?.name || '',
      password: value?.password,
      isAdmin: value?.isAdmin || false,
      isActive: value?.isActive ?? true,
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
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter username"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {requirePassword && (
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                !field.state.meta.isValid && field.state.meta.isTouched
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        )}

        <form.Field name="isAdmin">
          {(field) => (
            <Field orientation="horizontal">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) =>
                  field.handleChange(checked === true)
                }
                onBlur={field.handleBlur}
              />
              <FieldLabel htmlFor={field.name}>Admin</FieldLabel>
            </Field>
          )}
        </form.Field>

        <form.Field name="isActive">
          {(field) => (
            <Field orientation="horizontal">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) =>
                  field.handleChange(checked === true)
                }
                onBlur={field.handleBlur}
              />
              <FieldLabel htmlFor={field.name}>Active</FieldLabel>
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save User'}
        </Button>
      </div>
    </form>
  )
}
