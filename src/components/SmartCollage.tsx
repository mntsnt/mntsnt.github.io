'use client';

import React from 'react';
import Image from 'next/image';

interface SmartCollageProps {
  images: string[];
  title: string;
  layout?: 'auto' | 'split' | 'grid' | 'bento' | 'mosaic' | 'stack';
}

export function SmartCollage({ images, title, layout = 'auto' }: SmartCollageProps) {
  const count = images.length;

  // Single Image
  if (count <= 1) {
    return (
      <div className="relative aspect-[16/10] w-full bg-background-alt overflow-hidden">
        <Image
          src={images[0]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
    );
  }

  // 2 Images: Split Comparison
  if (count === 2 || layout === 'split') {
    return (
      <div className="relative aspect-[16/10] w-full grid grid-cols-2 gap-1 bg-background-alt overflow-hidden p-1">
        {images.slice(0, 2).map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image
              src={img}
              alt={`${title} - spec ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  // 3 Images: 1 Prominent + 2 Stacked
  if (count === 3) {
    return (
      <div className="relative aspect-[16/10] w-full grid grid-cols-3 gap-1 bg-background-alt overflow-hidden p-1">
        <div className="col-span-2 relative w-full h-full overflow-hidden">
          <Image
            src={images[0]}
            alt={`${title} - primary`}
            fill
            sizes="(max-width: 768px) 66vw, 30vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="col-span-1 grid grid-rows-2 gap-1">
          {images.slice(1, 3).map((img, i) => (
            <div key={i} className="relative w-full h-full overflow-hidden">
              <Image
                src={img}
                alt={`${title} - thumb ${i + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 15vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4 Images: 2x2 Grid
  if (count === 4 || layout === 'grid') {
    return (
      <div className="relative aspect-[16/10] w-full grid grid-cols-2 grid-rows-2 gap-1 bg-background-alt overflow-hidden p-1">
        {images.slice(0, 4).map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image
              src={img}
              alt={`${title} - grid ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  // 5-6 Images: Bento Mosaic
  if (count >= 5 && count <= 6) {
    return (
      <div className="relative aspect-[16/10] w-full grid grid-cols-4 grid-rows-2 gap-1 bg-background-alt overflow-hidden p-1">
        <div className="col-span-2 row-span-2 relative w-full h-full overflow-hidden">
          <Image
            src={images[0]}
            alt={`${title} - hero`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="col-span-1 row-span-1 relative w-full h-full overflow-hidden">
            <Image
              src={img}
              alt={`${title} - mosaic ${i + 1}`}
              fill
              sizes="(max-width: 768px) 25vw, 12vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  // 7+ Images: Mosaic with +N Overlay
  return (
    <div className="relative aspect-[16/10] w-full grid grid-cols-4 grid-rows-2 gap-1 bg-background-alt overflow-hidden p-1">
      <div className="col-span-2 row-span-2 relative w-full h-full overflow-hidden">
        <Image
          src={images[0]}
          alt={`${title} - hero`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      {images.slice(1, 4).map((img, i) => (
        <div key={i} className="col-span-1 row-span-1 relative w-full h-full overflow-hidden">
          <Image
            src={img}
            alt={`${title} - mosaic ${i + 1}`}
            fill
            sizes="(max-width: 768px) 25vw, 12vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ))}
      <div className="col-span-1 row-span-1 relative w-full h-full overflow-hidden">
        <Image
          src={images[4]}
          alt={`${title} - more`}
          fill
          sizes="(max-width: 768px) 25vw, 12vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-50"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white font-mono font-bold text-xs">
          +{count - 4}
        </div>
      </div>
    </div>
  );
}
