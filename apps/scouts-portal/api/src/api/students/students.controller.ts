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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @Post('students')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get('students/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch('students/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Delete('students/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }

  @Post('students/filter')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async filter(@Body() dto: FilterStudentsDto) {
    return this.studentsService.filter(dto);
  }

  @Get('classes/:slug/students')
  @UseGuards(JwtAuthGuard)
  async findByClassSlug(@Param('slug') slug: string) {
    return this.studentsService.findByClassSlug(slug);
  }

  @Post('classes/:slug/students')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createForClass(
    @Param('slug') slug: string,
    @Body() dto: CreateStudentDto,
  ) {
    return this.studentsService.createForClass(slug, { ...dto, classSlug: slug });
  }
}
