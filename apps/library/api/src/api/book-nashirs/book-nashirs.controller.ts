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
import { BookNashirsService } from './book-nashirs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsSuperAdminGuard } from '../auth/guards/is-super-admin.guard';
import { CreateBookNashirDto } from './dto/create-book-nashir.dto';

@Controller('api/book-nashirs')
@UseGuards(JwtAuthGuard)
export class BookNashirsController {
  constructor(private readonly bookNashirsService: BookNashirsService) { }

  @Get()
  async findAll() {
    const data = await this.bookNashirsService.findAll();
    return { success: true, data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBookNashirDto) {
    return this.bookNashirsService.create(dto);
  }

  @Delete(':id')
  @UseGuards(IsSuperAdminGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.bookNashirsService.remove(id);
  }
}
