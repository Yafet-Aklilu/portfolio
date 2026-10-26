"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
};

/**
 * Renders an image when a real src loads; otherwise a quiet placeholder.
 * Avoids broken-image icons when assets are not yet in /public.
 */
export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackLabel = "Image coming soon",
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  if (!showImage) {
    return (
      <div
        className={cn(
          "flex items-end border border-line bg-bg-elevated p-4",
          fallbackClassName ?? className,
        )}
        role="img"
        aria-label={alt || fallbackLabel}
      >
        <p className="text-label text-muted">{fallbackLabel}</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src!}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
