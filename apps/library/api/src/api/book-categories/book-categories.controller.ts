import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookCategoriesService } from './book-categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsSuperAdminGuard } from '../auth/guards/is-super-admin.guard';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';

@Controller('api/book-categories')
@UseGuards(JwtAuthGuard)
export class BookCategoriesController {
  constructor(private readonly bookCategoriesService: BookCategoriesService) { }

  @Get()
  async findAll() {
    const data = await this.bookCategoriesService.findAll();
    return { success: true, data };
  }

  @Post()
  @UseGuards(IsSuperAdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBookCategoryDto) {
    return this.bookCategoriesService.create(dto);
  }

  @Delete(':id')
  @UseGuards(IsSuperAdminGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.bookCategoriesService.remove(id);
  }
}
