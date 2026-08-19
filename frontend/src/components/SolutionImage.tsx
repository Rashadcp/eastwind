"use client";

import { useState } from "react";
import { formatImageUrl } from "@/utils/image";
import { Image as ImageIcon } from "lucide-react";

interface SolutionImageProps {
  imageUrl: string;
  title: string;
}

export default function SolutionImage({ imageUrl, title }: SolutionImageProps) {
  const [hasError, setHasError] = useState(false);

  const formattedUrl = imageUrl ? formatImageUrl(imageUrl) : "";

  if (!formattedUrl || hasError) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 space-y-1 text-slate-400">
        <ImageIcon className="w-8 h-8 text-slate-300 stroke-[1.5]" />
        <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
      </div>
    );
  }

  return (
    <img
      src={formattedUrl}
      alt={title}
      onError={() => setHasError(true)}
      className="w-full h-full max-h-full max-w-full block rounded-xl object-contain filter contrast-102"
    />
  );
}
