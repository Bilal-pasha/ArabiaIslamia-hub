import { apiClient } from '../../lib/axios-instance';

export interface PresignResponse {
  url: string;
  key: string;
}

export async function getPresignedUrl(
  field: string,
  filename: string,
  contentType?: string
): Promise<PresignResponse> {
  const { data } = await apiClient.post<PresignResponse>('/upload/presign', {
    field,
    filename,
    contentType,
  });
  return data;
}

export async function uploadToPresignedUrl(
  url: string,
  file: File
): Promise<void> {
  const response = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  });
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }
}
