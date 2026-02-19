import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookNashir } from '@arabiaaislamia/database';
import { CreateBookNashirDto } from './dto/create-book-nashir.dto';

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

  async remove(id: string) {
    const result = await this.nashirRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Nashir not found');
    return { success: true, message: 'Nashir deleted' };
  }
}
