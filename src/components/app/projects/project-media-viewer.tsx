'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { PhotoView } from 'react-photo-view'
import Flicking from '@egjs/react-flicking'

// Import styles
import '@egjs/react-flicking/dist/flicking.css'
import 'react-photo-view/dist/react-photo-view.css'

interface ProjectMediaViewerProps {
  images: string[]
  title: string
}

export function ProjectMediaViewer({ images, title }: ProjectMediaViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const flickingRef = useRef<Flicking | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleNext = () => {
    flickingRef.current?.next().catch((err) => console.log(err))
  }

  const handlePrev = () => {
    flickingRef.current?.prev().catch((err) => console.log(err))
  }

  if (!mounted) {
    // Return a beautiful loading/static placeholder skeleton for SSR
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="relative aspect-video w-full overflow-hidden bg-black/95 flex items-center justify-center">
          {images.length > 0 && (
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-contain opacity-40 blur-xs"
              priority
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Loading gallery...
          </div>
        </div>
      </div>
    )
  }

  const coverImage =
    images.length > 0
      ? images[0]
      : 'https://deifkwefumgah.cloudfront.net/photos/tiny-home/erik-mclean-g3U7sqtdJ1w-unsplash.jpg'

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main egjs-flicking Carousel Wrapper */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/95 group/carousel">
        {images.length > 0 ? (
          <Flicking
            ref={flickingRef}
            align="center"
            circular={images.length > 1}
            onChanged={(e) => setCurrentIndex(e.index)}
            className="w-full h-full"
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="w-full h-full relative aspect-video shrink-0 cursor-zoom-in flex items-center justify-center"
              >
                <PhotoView src={img}>
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`${title} view ${idx + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain"
                      priority={idx === 0}
                    />
                  </div>
                </PhotoView>
              </div>
            ))}
          </Flicking>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2  text-white rounded-full p-2.5 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white rounded-full p-2.5 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Index Tracker */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs text-white font-medium z-10">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectMediaViewer
