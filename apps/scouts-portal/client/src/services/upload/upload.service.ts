import { apiClient } from "@/utils/axios-instance";
import { uploadEndpoints } from "@/constant/api-endpoints";

export interface PresignResponse {
  url: string;
  key: string;
}

export async function getPresignedUrl(
  field: string,
  filename: string,
  contentType?: string
): Promise<PresignResponse> {
  const { data } = await apiClient.post<PresignResponse>(uploadEndpoints.presign, {
    field,
    filename,
    contentType,
  });
  return data;
}

export async function uploadToPresignedUrl(url: string, file: File): Promise<void> {
  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }
}

export async function getFileViewUrl(key: string): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>(uploadEndpoints.presignGet(key));
  return data.url;
}
