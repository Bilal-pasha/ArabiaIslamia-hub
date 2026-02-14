import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '@arabiaaislamia/database';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async create(dto: CreateBookDto) {
    const book = this.bookRepository.create({
      title: dto.title,
      author: dto.author ?? null,
      isbn: dto.isbn ?? null,
      category: dto.category ?? null,
      totalCopies: dto.totalCopies ?? 1,
    });
    const saved = await this.bookRepository.save(book);
    return { success: true, message: 'Book created', data: saved };
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.author !== undefined && { author: dto.author }),
      ...(dto.isbn !== undefined && { isbn: dto.isbn }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.totalCopies !== undefined && { totalCopies: dto.totalCopies }),
    });
    const saved = await this.bookRepository.save(book);
    return { success: true, message: 'Book updated', data: saved };
  }

  async remove(id: string) {
    const result = await this.bookRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Book not found');
    return { success: true, message: 'Book deleted' };
  }
}
