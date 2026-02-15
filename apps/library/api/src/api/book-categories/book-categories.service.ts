import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCategory } from '@arabiaaislamia/database';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';

@Injectable()
export class BookCategoriesService {
  constructor(
    @InjectRepository(BookCategory)
    private readonly categoryRepository: Repository<BookCategory>,
  ) { }

  async findAll(): Promise<BookCategory[]> {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateBookCategoryDto) {
    const category = this.categoryRepository.create({ name: dto.name.trim() });
    const saved = await this.categoryRepository.save(category);
    return { success: true, message: 'Category created', data: saved };
  }

  async remove(id: string) {
    const result = await this.categoryRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Category not found');
    return { success: true, message: 'Category deleted' };
  }
}
