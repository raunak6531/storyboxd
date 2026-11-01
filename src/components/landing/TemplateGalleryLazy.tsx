'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const DynamicTemplateGallery = dynamic(
  () => import('./TemplateGallery').then((mod) => mod.TemplateGallery),
  {
    ssr: false,
    loading: () => <GalleryPlaceholder />,
  }
);

function GalleryPlaceholder() {
  return (
    <div className="flex gap-6 overflow-hidden py-4 px-1 min-h-[570px] items-center justify-start opacity-30">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="w-[280px] h-[498px] rounded-[28px] bg-[#101010] border border-[#242424] flex-none animate-pulse"
        />
      ))}
    </div>
  );
}

export function TemplateGalleryLazy() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="min-h-[570px]">
      {shouldLoad ? <DynamicTemplateGallery /> : <GalleryPlaceholder />}
    </div>
  );
}

