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
import { MadrasasService } from './madrasas.service';
import { CreateMadrasaDto } from './dto/create-madrasa.dto';
import { UpdateMadrasaStatusDto } from './dto/update-madrasa-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ScoutsUser } from '@arabiaaislamia/database';

@Controller('api/madrasas')
export class MadrasasController {
  constructor(private readonly madrasasService: MadrasasService) { }

  @Get('names')
  async getNames() {
    const names = await this.madrasasService.getNames();
    return { success: true, data: names };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMadrasaDto, @CurrentUser() user: ScoutsUser) {
    return this.madrasasService.create({ ...dto, userId: user.id });
  }

  @Get(':id/students')
  @UseGuards(JwtAuthGuard)
  async getStudents(@Param('id') id: string) {
    return this.madrasasService.getStudentsByMadrasaId(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findByUserOrAdmin(@Param('id') id: string, @CurrentUser() user: ScoutsUser) {
    return this.madrasasService.findByUserOrAdmin(id, user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMadrasaStatusDto,
  ) {
    return this.madrasasService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return this.madrasasService.delete(id);
  }
}
