import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookNashir } from '@arabiaaislamia/database';
import { CreateBookNashirDto } from './dto/create-book-nashir.dto';
import { UpdateBookNashirDto } from './dto/update-book-nashir.dto';

@Injectable()
export class BookNashirsService {
  constructor(
    @InjectRepository(BookNashir)
    private readonly nashirRepository: Repository<BookNashir>,
  ) { }

  async findAll(): Promise<BookNashir[]> {
    return this.nashirRepository.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateBookNashirDto) {
    const nashir = this.nashirRepository.create({ name: dto.name.trim() });
    const saved = await this.nashirRepository.save(nashir);
    return { success: true, message: 'Nashir created', data: saved };
  }

  async update(id: string, dto: UpdateBookNashirDto) {
    const nashir = await this.nashirRepository.findOne({ where: { id } });
    if (!nashir) throw new NotFoundException('Nashir not found');
    nashir.name = dto.name.trim();
    const saved = await this.nashirRepository.save(nashir);
    return { success: true, message: 'Nashir updated', data: saved };
  }

  async remove(id: string) {
    const result = await this.nashirRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Nashir not found');
    return { success: true, message: 'Nashir deleted' };
  }
}
