import { apiClient } from '@/utils/axios-instance';

export interface HeroSlideDto {
  id: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  sortOrder: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSectionDto {
  id: string;
  page: string;
  sectionKey: string;
  sectionType: string;
  content: Record<string, unknown> | null;
  sortOrder: number;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicHomeDto {
  heroSlides: Array<{
    id: string;
    desktopImageUrl: string;
    mobileImageUrl: string;
    title: string;
    subtitle: string;
    sortOrder: number;
  }>;
  sections: Array<{
    id: string;
    page: string;
    sectionKey: string;
    sectionType: string;
    content: Record<string, unknown> | null;
    sortOrder: number;
  }>;
}

export async function getPublicHome(): Promise<PublicHomeDto> {
  const res = await apiClient.get<PublicHomeDto>('/api/cms/public/home');
  return res.data;
}

export async function listHeroSlides(): Promise<HeroSlideDto[]> {
  const res = await apiClient.get<HeroSlideDto[]>('/api/cms/hero-slides');
  return res.data;
}

export async function createHeroSlide(dto: {
  desktopImageUrl: string;
  mobileImageUrl: string;
  title?: string;
  subtitle?: string;
  sortOrder?: number;
  isActive?: boolean;
}): Promise<HeroSlideDto> {
  const res = await apiClient.post<HeroSlideDto>('/api/cms/hero-slides', dto);
  return res.data;
}

export async function updateHeroSlide(
  id: string,
  dto: Partial<{
    desktopImageUrl: string;
    mobileImageUrl: string;
    title: string;
    subtitle: string;
    sortOrder: number;
    isActive: boolean;
  }>,
): Promise<HeroSlideDto> {
  const res = await apiClient.put<HeroSlideDto>(`/api/cms/hero-slides/${id}`, dto);
  return res.data;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  await apiClient.delete(`/api/cms/hero-slides/${id}`);
}

export async function listSections(page?: string): Promise<SiteSectionDto[]> {
  const params = page ? { page } : {};
  const res = await apiClient.get<SiteSectionDto[]>('/api/cms/sections', { params });
  return res.data;
}

export async function getSection(id: string): Promise<SiteSectionDto> {
  const res = await apiClient.get<SiteSectionDto>(`/api/cms/sections/${id}`);
  return res.data;
}

export async function updateSection(
  id: string,
  dto: Partial<{
    page: string;
    sectionKey: string;
    sectionType: string;
    content: Record<string, unknown>;
    sortOrder: number;
    isVisible: boolean;
  }>,
): Promise<SiteSectionDto> {
  const res = await apiClient.put<SiteSectionDto>(`/api/cms/sections/${id}`, dto);
  return res.data;
}

export async function createSection(dto: {
  page?: string;
  sectionKey: string;
  sectionType: string;
  content?: Record<string, unknown>;
  sortOrder?: number;
  isVisible?: boolean;
}): Promise<SiteSectionDto> {
  const res = await apiClient.post<SiteSectionDto>('/api/cms/sections', dto);
  return res.data;
}

export async function deleteSection(id: string): Promise<void> {
  await apiClient.delete(`/api/cms/sections/${id}`);
}
