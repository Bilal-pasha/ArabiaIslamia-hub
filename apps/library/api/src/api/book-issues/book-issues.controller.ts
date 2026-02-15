import {
  Controller,
  Get,
  Post,
  Delete,
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
  constructor(private readonly bookIssuesService: BookIssuesService) { }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('bookId') bookId?: string,
    @Query('status') status?: string,
    @Query('issuedTo') issuedTo?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit || '10', 10) || 10));
    const filters = {
      bookId: bookId?.trim(),
      status: status?.trim(),
      issuedTo: issuedTo?.trim(),
    };
    return this.bookIssuesService.findAllPaginated(pageNum, limitNum, filters);
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

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.bookIssuesService.remove(id);
  }
}
