'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { toast } from 'sonner'
import { InputField, PasswordField } from '@/components/shared/form/input'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(async (values: LoginFormValues) => {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: true,
    })
    if (error) {
      toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    }
    redirect('/dashboard')
  }, [])

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>เข้าสู่ระบบ</CardTitle>
          <CardDescription>
            กรอกอีเมลของคุณด้านล่างเพื่อเข้าสู่ระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FieldGroup>
              <InputField
                control={methods.control}
                name="email"
                label="อีเมล"
              />
              <PasswordField
                control={methods.control}
                name="password"
                label="รหัสผ่าน"
              />
              <Field>
                <Button type="submit">เข้าสู่ระบบ</Button>
                {/* <Button variant="outline" type="button">
                  เข้าสู่ระบบด้วย Google
                </Button>
                <FieldDescription className="text-center">
                  ยังไม่มีบัญชีใช่ไหม? <a href="#">สมัครสมาชิก</a>
                </FieldDescription> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
