import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('category') category?: string,
    @Query('jillNumber') jillNumber?: string,
    @Query('kitaabNumber') kitaabNumber?: string,
    @Query('muarafName') muarafName?: string,
    @Query('naashirName') naashirName?: string,
    @Query('madahUnvaan') madahUnvaan?: string,
    @Query('shelfNumber') shelfNumber?: string,
    @Query('keefiyat') keefiyat?: string,
    @Query('milkiyat') milkiyat?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit || '10', 10) || 10));
    const filters = {
      title: title?.trim(),
      author: author?.trim(),
      category: category?.trim(),
      jillNumber: jillNumber?.trim(),
      kitaabNumber: kitaabNumber?.trim(),
      muarafName: muarafName?.trim(),
      naashirName: naashirName?.trim(),
      madahUnvaan: madahUnvaan?.trim(),
      shelfNumber: shelfNumber?.trim(),
      keefiyat: keefiyat?.trim(),
      milkiyat: milkiyat?.trim(),
    };
    return this.booksService.findAllPaginated(pageNum, limitNum, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.booksService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
