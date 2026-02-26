import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookIssue } from '@arabiaaislamia/database';
import { CreateBookIssueDto } from './dto/create-book-issue.dto';
import { UpdateBookIssueDto } from './dto/update-book-issue.dto';

export interface IssueFilters {
  bookId?: string;
  status?: string;
  issuedTo?: string;
}

@Injectable()
export class BookIssuesService {
  constructor(
    @InjectRepository(BookIssue)
    private readonly issueRepository: Repository<BookIssue>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  async findAll(filters?: IssueFilters) {
    const qb = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.book', 'book')
      .orderBy('issue.issuedAt', 'DESC');
    if (filters?.bookId) qb.andWhere('issue.book_id = :bookId', { bookId: filters.bookId });
    if (filters?.status) qb.andWhere('issue.status = :status', { status: filters.status });
    if (filters?.issuedTo) qb.andWhere('issue.issued_to ILIKE :issuedTo', { issuedTo: `%${filters.issuedTo}%` });
    const data = await qb.getMany();
    return { success: true, data };
  }

  async findAllPaginated(
    page: number,
    limit: number,
    filters: IssueFilters,
  ): Promise<{ success: boolean; data: BookIssue[]; total: number; page: number; limit: number; totalPages: number }> {
    const qb = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.book', 'book')
      .orderBy('issue.issuedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filters.bookId) qb.andWhere('issue.book_id = :bookId', { bookId: filters.bookId });
    if (filters.status) qb.andWhere('issue.status = :status', { status: filters.status });
    if (filters.issuedTo) qb.andWhere('issue.issued_to ILIKE :issuedTo', { issuedTo: `%${filters.issuedTo}%` });

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    return { success: true, data, total, page, limit, totalPages };
  }

  async findOne(id: string) {
    const issue = await this.issueRepository.findOne({
      where: { id },
      relations: ['book'],
    });
    if (!issue) throw new NotFoundException('Book issue not found');
    return issue;
  }

  async create(dto: CreateBookIssueDto) {
    const book = await this.bookRepository.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');
    const issuedCount = await this.issueRepository.count({
      where: { bookId: dto.bookId, status: 'issued' },
    });
    if (issuedCount >= book.totalCopies) {
      throw new BadRequestException('No copies available for this book');
    }
    const issue = this.issueRepository.create({
      bookId: dto.bookId,
      issuedTo: dto.issuedTo,
      issuedAt: new Date(),
      dueAt: new Date(dto.dueAt),
      status: 'issued',
    });
    const saved = await this.issueRepository.save(issue);
    return { success: true, message: 'Book issued', data: await this.findOne(saved.id) };
  }

  async update(id: string, dto: UpdateBookIssueDto) {
    const issue = await this.issueRepository.findOne({ where: { id } });
    if (!issue) throw new NotFoundException('Book issue not found');
    if (issue.status === 'returned') {
      throw new BadRequestException('Cannot update a returned issue');
    }
    if (dto.bookId !== undefined) {
      const book = await this.bookRepository.findOne({ where: { id: dto.bookId } });
      if (!book) throw new NotFoundException('Book not found');
      issue.bookId = dto.bookId;
    }
    if (dto.issuedTo !== undefined) issue.issuedTo = dto.issuedTo;
    if (dto.dueAt !== undefined) issue.dueAt = new Date(dto.dueAt);
    const saved = await this.issueRepository.save(issue);
    return { success: true, message: 'Issue updated', data: await this.findOne(saved.id) };
  }

  async returnBook(id: string) {
    const issue = await this.issueRepository.findOne({ where: { id } });
    if (!issue) throw new NotFoundException('Book issue not found');
    if (issue.status === 'returned') {
      throw new BadRequestException('Book already returned');
    }
    issue.returnedAt = new Date();
    issue.status = 'returned';
    const saved = await this.issueRepository.save(issue);
    return { success: true, message: 'Book returned', data: await this.findOne(saved.id) };
  }

  async remove(id: string) {
    const result = await this.issueRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Book issue not found');
    return { success: true, message: 'Book issue deleted' };
  }
}
