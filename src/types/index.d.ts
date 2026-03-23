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


type UploadResult = {
  folder: string
  original: {
    path: string
    contentType: string
    url: string
  }
  webp: {
    path: string
    contentType: string
    url: string
  }
}
