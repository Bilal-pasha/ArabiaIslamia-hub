"use client";

import { useState, useEffect } from "react";
import { getFileViewUrl } from "@/services/upload/upload.service";

/**
 * Returns a display URL for fileUrl. If fileUrl looks like an R2 key (no http),
 * fetches a presigned GET URL; otherwise returns fileUrl as-is (e.g. legacy full URL).
 */
export function usePresignedFileUrl(fileUrl: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fileUrl) {
      setUrl(null);
      return;
    }
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      setUrl(fileUrl);
      return;
    }
    let cancelled = false;
    getFileViewUrl(fileUrl)
      .then((presignedUrl) => {
        if (!cancelled) setUrl(presignedUrl);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  return url;
}
