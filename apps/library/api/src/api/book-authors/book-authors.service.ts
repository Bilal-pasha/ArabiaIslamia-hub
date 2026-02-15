import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookAuthor } from '@arabiaaislamia/database';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';

@Injectable()
export class BookAuthorsService {
  constructor(
    @InjectRepository(BookAuthor)
    private readonly authorRepository: Repository<BookAuthor>,
  ) { }

  async findAll(): Promise<BookAuthor[]> {
    return this.authorRepository.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateBookAuthorDto) {
    const author = this.authorRepository.create({ name: dto.name.trim() });
    const saved = await this.authorRepository.save(author);
    return { success: true, message: 'Author created', data: saved };
  }

  async remove(id: string) {
    const result = await this.authorRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Author not found');
    return { success: true, message: 'Author deleted' };
  }
}
