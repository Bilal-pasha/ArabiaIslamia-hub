import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';
import { CreateSiteSectionDto, UpdateSiteSectionDto } from './dto/site-section.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('public/home')
  getPublicHome() {
    return this.cmsService.getPublicHome();
  }

  @Get('hero-slides')
  @UseGuards(JwtAuthGuard)
  listHeroSlides() {
    return this.cmsService.listHeroSlides();
  }

  @Post('hero-slides')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createHeroSlide(@Body() dto: CreateHeroSlideDto) {
    return this.cmsService.createHeroSlide(dto);
  }

  @Get('hero-slides/:id')
  @UseGuards(JwtAuthGuard)
  getHeroSlide(@Param('id') id: string) {
    return this.cmsService.getHeroSlide(id);
  }

  @Put('hero-slides/:id')
  @UseGuards(JwtAuthGuard)
  updateHeroSlide(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto) {
    return this.cmsService.updateHeroSlide(id, dto);
  }

  @Delete('hero-slides/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteHeroSlide(@Param('id') id: string) {
    return this.cmsService.deleteHeroSlide(id);
  }

  @Get('sections')
  @UseGuards(JwtAuthGuard)
  listSections(@Query('page') page?: string) {
    return this.cmsService.listSections(page);
  }

  @Post('sections')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createSection(@Body() dto: CreateSiteSectionDto) {
    return this.cmsService.createSection(dto);
  }

  @Get('sections/:id')
  @UseGuards(JwtAuthGuard)
  getSection(@Param('id') id: string) {
    return this.cmsService.getSection(id);
  }

  @Put('sections/:id')
  @UseGuards(JwtAuthGuard)
  updateSection(@Param('id') id: string, @Body() dto: UpdateSiteSectionDto) {
    return this.cmsService.updateSection(id, dto);
  }

  @Delete('sections/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSection(@Param('id') id: string) {
    return this.cmsService.deleteSection(id);
  }
}
