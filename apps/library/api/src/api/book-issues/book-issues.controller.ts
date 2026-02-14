import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookIssuesService } from './book-issues.service';
import { CreateBookIssueDto } from './dto/create-book-issue.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/book-issues')
@UseGuards(JwtAuthGuard)
export class BookIssuesController {
  constructor(private readonly bookIssuesService: BookIssuesService) {}

  @Get()
  async findAll(
    @Query('bookId') bookId?: string,
    @Query('status') status?: string,
  ) {
    return this.bookIssuesService.findAll(
      bookId || status ? { bookId, status } : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.bookIssuesService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBookIssueDto) {
    return this.bookIssuesService.create(dto);
  }

  @Post(':id/return')
  @HttpCode(HttpStatus.OK)
  async returnBook(@Param('id') id: string) {
    return this.bookIssuesService.returnBook(id);
  }
}
