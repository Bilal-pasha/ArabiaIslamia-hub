"use client";

import React from "react";
import Image from "next/image";
import { usePresignedFileUrl } from "@/hooks/usePresignedFileUrl/usePresignedFileUrl";

interface PresignedImageProps extends Omit<React.ComponentProps<typeof Image>, "src"> {
  fileUrl: string | null | undefined;
  alt: string;
  /** When true, use native img to avoid Next Image domain config for presigned URLs */
  unoptimized?: boolean;
}

/**
 * Renders an image from fileUrl. If fileUrl is an R2 key, fetches presigned GET URL first.
 * Use for student photos and any fileUrl that may be a key.
 */
export function PresignedImage({ fileUrl, alt, unoptimized = true, ...props }: PresignedImageProps) {
  const url = usePresignedFileUrl(fileUrl);

  if (!url) {
    return null;
  }

  return <Image src={url} alt={alt} unoptimized={unoptimized} {...props} />;
}
