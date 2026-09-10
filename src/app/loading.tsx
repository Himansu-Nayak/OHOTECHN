import React from 'react';
import Image from 'next/image';

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#f7f7f5] text-[#0d0d0e]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center animate-pulse">
          <Image
            src="/OHO_TECH_LOGO.png"
            alt="OHO TECH"
            width={240}
            height={70}
            priority
            quality={100}
            unoptimized
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
