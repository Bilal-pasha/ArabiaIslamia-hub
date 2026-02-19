import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '@arabiaaislamia/database';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export interface BookFilters {
  bookNumber?: string;
  title?: string;
  author?: string;
  category?: string;
  jillNumber?: string;
  kitaabNumber?: string;
  muarafName?: string;
  naashirName?: string;
  language?: string;
  shelfNumber?: string;
  keefiyat?: string;
  milkiyat?: string;
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPaginated(
    page: number,
    limit: number,
    filters: BookFilters,
  ): Promise<{ success: boolean; data: Book[]; total: number; page: number; limit: number; totalPages: number }> {
    const qb = this.bookRepository
      .createQueryBuilder('book')
      .orderBy('book.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const colMap: Partial<Record<keyof BookFilters, string>> = {
      bookNumber: 'book_number',
      jillNumber: 'jill_number',
      kitaabNumber: 'kitaab_number',
      muarafName: 'muaraf_name',
      naashirName: 'naashir_name',
      shelfNumber: 'shelf_number',
    };
    const filterKeys = Object.keys(filters) as (keyof BookFilters)[];
    for (const key of filterKeys) {
      const val = filters[key];
      if (val) {
        const col = colMap[key] ?? key;
        qb.andWhere(`book.${col} ILIKE :${key}`, { [key]: `%${val}%` });
      }
    }

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    return { success: true, data, total, page, limit, totalPages };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async create(dto: CreateBookDto) {
    const bookNumber = await this.generateNextBookNumber();
    const book = this.bookRepository.create({
      bookNumber,
      title: dto.title,
      author: dto.author ?? null,
      isbn: dto.isbn ?? null,
      category: dto.category ?? null,
      jillNumber: dto.jillNumber ?? null,
      kitaabNumber: dto.kitaabNumber ?? null,
      muarafName: dto.muarafName ?? null,
      naashirName: dto.naashirName ?? null,
      language: dto.language ?? null,
      shelfNumber: dto.shelfNumber ?? null,
      keefiyat: dto.keefiyat ?? null,
      milkiyat: dto.milkiyat ?? null,
      totalCopies: dto.totalCopies ?? 1,
    });
    const saved = await this.bookRepository.save(book);
    return { success: true, message: 'Book created', data: saved };
  }

  private async generateNextBookNumber(): Promise<string> {
    const result = await this.bookRepository.query(
      `SELECT 'BKN-' || LPAD(nextval('book_number_seq')::text, 6, '0') as num`,
    );
    return result?.[0]?.num ?? `BKN-${String(Date.now()).slice(-6)}`;
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.author !== undefined && { author: dto.author }),
      ...(dto.isbn !== undefined && { isbn: dto.isbn }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.jillNumber !== undefined && { jillNumber: dto.jillNumber }),
      ...(dto.kitaabNumber !== undefined && { kitaabNumber: dto.kitaabNumber }),
      ...(dto.muarafName !== undefined && { muarafName: dto.muarafName }),
      ...(dto.naashirName !== undefined && { naashirName: dto.naashirName }),
      ...(dto.language !== undefined && { language: dto.language }),
      ...(dto.shelfNumber !== undefined && { shelfNumber: dto.shelfNumber }),
      ...(dto.keefiyat !== undefined && { keefiyat: dto.keefiyat }),
      ...(dto.milkiyat !== undefined && { milkiyat: dto.milkiyat }),
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
