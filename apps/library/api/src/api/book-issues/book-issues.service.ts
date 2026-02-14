import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookIssue } from '@arabiaaislamia/database';
import { CreateBookIssueDto } from './dto/create-book-issue.dto';

@Injectable()
export class BookIssuesService {
  constructor(
    @InjectRepository(BookIssue)
    private readonly issueRepository: Repository<BookIssue>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(filters?: { bookId?: string; status?: string }) {
    const qb = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.book', 'book')
      .orderBy('issue.issuedAt', 'DESC');
    if (filters?.bookId) qb.andWhere('issue.bookId = :bookId', { bookId: filters.bookId });
    if (filters?.status) qb.andWhere('issue.status = :status', { status: filters.status });
    const data = await qb.getMany();
    return { success: true, data };
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
}
