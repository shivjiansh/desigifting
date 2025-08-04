'use client'
import { useState, useEffect, useCallback } from 'react'

type ImageCarouselProps = {
  images: string[]
  altPrefix?: string
}

export default function ImageCarousel({ images, altPrefix = 'Product image' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  // Keyboard navigation handler
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prev, next])

  if (!images || images.length === 0) return null

  return (
    <div className="relative w-full h-48 mb-4 select-none">
      <img
        src={images[currentIndex]}
        alt={`${altPrefix} ${currentIndex + 1}`}
        className="w-full h-full object-cover rounded"
        draggable={false}
      />
      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 text-white w-8 h-8 rounded-full flex items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next image"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 text-white w-8 h-8 rounded-full flex items-center justify-center"
      >
        ›
      </button>
      <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-60 text-xs text-white px-2 py-1 rounded">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}
