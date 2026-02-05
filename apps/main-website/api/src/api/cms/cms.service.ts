import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroSlide, SiteSection, type SectionType } from '@arabiaaislamia/database';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';
import { CreateSiteSectionDto, UpdateSiteSectionDto } from './dto/site-section.dto';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(HeroSlide)
    private readonly heroSlideRepo: Repository<HeroSlide>,
    @InjectRepository(SiteSection)
    private readonly siteSectionRepo: Repository<SiteSection>,
  ) {}

  async getPublicHome(): Promise<{
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
      sectionType: SectionType;
      content: Record<string, unknown> | null;
      sortOrder: number;
    }>;
  }> {
    const [heroSlides, sections] = await Promise.all([
      this.heroSlideRepo.find({
        where: { isActive: true },
        order: { sortOrder: 'ASC' },
        select: ['id', 'desktopImageUrl', 'mobileImageUrl', 'title', 'subtitle', 'sortOrder'],
      }),
      this.siteSectionRepo.find({
        where: { page: 'home', isVisible: true },
        order: { sortOrder: 'ASC' },
        select: ['id', 'page', 'sectionKey', 'sectionType', 'content', 'sortOrder'],
      }),
    ]);
    return {
      heroSlides: heroSlides.map((s) => ({
        id: s.id,
        desktopImageUrl: s.desktopImageUrl,
        mobileImageUrl: s.mobileImageUrl,
        title: s.title,
        subtitle: s.subtitle,
        sortOrder: s.sortOrder,
      })),
      sections: sections.map((s) => ({
        id: s.id,
        page: s.page,
        sectionKey: s.sectionKey,
        sectionType: s.sectionType as SectionType,
        content: s.content,
        sortOrder: s.sortOrder,
      })),
    };
  }

  async listHeroSlides(): Promise<HeroSlide[]> {
    return this.heroSlideRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async createHeroSlide(dto: CreateHeroSlideDto): Promise<HeroSlide> {
    const slide = this.heroSlideRepo.create({
      desktopImageUrl: dto.desktopImageUrl,
      mobileImageUrl: dto.mobileImageUrl,
      title: dto.title ?? '',
      subtitle: dto.subtitle ?? '',
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.heroSlideRepo.save(slide);
  }

  async getHeroSlide(id: string): Promise<HeroSlide> {
    const slide = await this.heroSlideRepo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException('Hero slide not found');
    return slide;
  }

  async updateHeroSlide(id: string, dto: UpdateHeroSlideDto): Promise<HeroSlide> {
    const slide = await this.getHeroSlide(id);
    if (dto.desktopImageUrl != null) slide.desktopImageUrl = dto.desktopImageUrl;
    if (dto.mobileImageUrl != null) slide.mobileImageUrl = dto.mobileImageUrl;
    if (dto.title != null) slide.title = dto.title;
    if (dto.subtitle != null) slide.subtitle = dto.subtitle;
    if (dto.sortOrder != null) slide.sortOrder = dto.sortOrder;
    if (dto.isActive != null) slide.isActive = dto.isActive;
    return this.heroSlideRepo.save(slide);
  }

  async deleteHeroSlide(id: string): Promise<void> {
    const slide = await this.getHeroSlide(id);
    await this.heroSlideRepo.remove(slide);
  }

  async listSections(page?: string): Promise<SiteSection[]> {
    const qb = this.siteSectionRepo.createQueryBuilder('s').orderBy('s.sortOrder', 'ASC');
    if (page) qb.andWhere('s.page = :page', { page });
    return qb.getMany();
  }

  async createSection(dto: CreateSiteSectionDto): Promise<SiteSection> {
    const section = this.siteSectionRepo.create({
      page: dto.page ?? 'home',
      sectionKey: dto.sectionKey,
      sectionType: dto.sectionType as SectionType,
      content: dto.content ?? null,
      sortOrder: dto.sortOrder ?? 0,
      isVisible: dto.isVisible ?? true,
    });
    return this.siteSectionRepo.save(section);
  }

  async getSection(id: string): Promise<SiteSection> {
    const section = await this.siteSectionRepo.findOne({ where: { id } });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  async updateSection(id: string, dto: UpdateSiteSectionDto): Promise<SiteSection> {
    const section = await this.getSection(id);
    if (dto.page != null) section.page = dto.page;
    if (dto.sectionKey != null) section.sectionKey = dto.sectionKey;
    if (dto.sectionType != null) section.sectionType = dto.sectionType as SectionType;
    if (dto.content != null) section.content = dto.content;
    if (dto.sortOrder != null) section.sortOrder = dto.sortOrder;
    if (dto.isVisible != null) section.isVisible = dto.isVisible;
    return this.siteSectionRepo.save(section);
  }

  async deleteSection(id: string): Promise<void> {
    const section = await this.getSection(id);
    await this.siteSectionRepo.remove(section);
  }
}
