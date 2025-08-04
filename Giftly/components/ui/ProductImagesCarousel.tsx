import { useState } from 'react';

function ProductImagesCarousel({ images, name }: { images: string[], name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative">
      <img
        src={images[currentIndex]}
        alt={`${name} image ${currentIndex + 1}`}
        className="w-full h-64 object-cover rounded mb-2"
      />
      <button onClick={prev} className="absolute left-2 top-1/2 bg-gray-700 text-white rounded px-2 py-1">‹</button>
      <button onClick={next} className="absolute right-2 top-1/2 bg-gray-700 text-white rounded px-2 py-1">›</button>
    </div>
  );
}

// Usage inside product card:
<ProductImagesCarousel images={product.images} name={product.name} />
