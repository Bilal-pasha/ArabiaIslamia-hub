import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookAuthorsService } from './book-authors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsSuperAdminGuard } from '../auth/guards/is-super-admin.guard';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';

@Controller('api/book-authors')
@UseGuards(JwtAuthGuard)
export class BookAuthorsController {
  constructor(private readonly bookAuthorsService: BookAuthorsService) { }

  @Get()
  async findAll() {
    const data = await this.bookAuthorsService.findAll();
    return { success: true, data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBookAuthorDto) {
    return this.bookAuthorsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(IsSuperAdminGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateBookAuthorDto) {
    return this.bookAuthorsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(IsSuperAdminGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.bookAuthorsService.remove(id);
  }
}
