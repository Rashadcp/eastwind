"use client";

import { useState } from "react";
import { formatImageUrl } from "@/utils/image";
import { Image as ImageIcon } from "lucide-react";

interface SolutionImageProps {
  imageUrl: string;
  title: string;
}

const DEFAULT_FALLBACK = "/products/default-process-instrumentation.png";

export default function SolutionImage({ imageUrl, title }: SolutionImageProps) {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(imageUrl ? formatImageUrl(imageUrl) : DEFAULT_FALLBACK);

  if (!currentSrc || hasError) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 space-y-1 text-slate-400">
        <ImageIcon className="w-8 h-8 text-slate-300 stroke-[1.5]" />
        <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={title}
      onError={() => {
        if (currentSrc !== DEFAULT_FALLBACK && currentSrc !== formatImageUrl(DEFAULT_FALLBACK)) {
          setCurrentSrc(DEFAULT_FALLBACK);
        } else {
          setHasError(true);
        }
      }}
      className="w-full h-full object-cover filter contrast-102 transition-transform duration-700 hover:scale-105"
    />
  );
}
