import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import './style.css'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReactQueryProvider } from '@/lib/query-provider'
import { OverlayProvider } from '@/hooks/overlay-provider'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Mini Gallery',
  description: 'A collection of my personal projects, showcasing my skills and creativity.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', poppins.variable, 'font-sans')}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <OverlayProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </OverlayProvider>
        </ReactQueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
