type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T | null
  error?: string | null
}

type FormProps<T> = {
  value?: T
  isLoading?: boolean
  onSubmit: (data: T) => void
}
