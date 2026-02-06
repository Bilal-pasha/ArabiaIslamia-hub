import { apiClient } from '@/utils/axios-instance';

export interface PresignResult {
  url: string;
  key: string;
  publicUrl?: string;
}

/** Get a presigned PUT URL for uploading a file. Requires admin auth. */
export async function getPresignedUrl(
  field: string,
  filename: string,
  contentType?: string
): Promise<PresignResult> {
  const res = await apiClient.post<PresignResult>('/api/upload/presign', {
    field,
    filename,
    contentType,
  });
  return res.data;
}

/** Upload a file to a presigned PUT URL (e.g. R2). No auth – the URL is temporary. */
export async function uploadToPresignedUrl(
  putUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(putUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  });
  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
  }
}

/** Get presigned URL, upload file, return the public URL to use in CMS. */
export async function uploadFile(
  field: string,
  file: File
): Promise<string> {
  const { url, publicUrl } = await getPresignedUrl(
    field,
    file.name,
    file.type || undefined
  );
  await uploadToPresignedUrl(url, file);
  if (!publicUrl) {
    throw new Error('Upload completed but public URL not configured (R2_PUBLIC_BASE_URL).');
  }
  return publicUrl;
}
