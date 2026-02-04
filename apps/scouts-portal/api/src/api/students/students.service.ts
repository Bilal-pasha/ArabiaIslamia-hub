import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Madrasa, ScoutsStudent } from '@arabiaaislamia/database';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(ScoutsStudent)
    private readonly studentRepository: Repository<ScoutsStudent>,
    @InjectRepository(Madrasa)
    private readonly madrasaRepository: Repository<Madrasa>,
  ) { }

  async create(dto: CreateStudentDto) {
    let madrasaName: string | null = dto.madrasaName ?? null;
    if (dto.madrasaId) {
      const madrasa = await this.madrasaRepository.findOne({
        where: { id: dto.madrasaId },
      });
      if (!madrasa) throw new NotFoundException('Madrasa not found');
      madrasaName = madrasa.madrasaName;
    }
    const student = this.studentRepository.create({
      madrasaId: dto.madrasaId ?? null,
      madrasaName,
      studentName: dto.studentName ?? dto.name ?? null,
      fatherName: dto.FatherName ?? dto.fatherName ?? null,
      ageGroup: dto.ageGroup ?? null,
      grade: dto.grade ?? null,
      TshirtSize: dto.TshirtSize ?? null,
      status: dto.status ?? 'Pending',
      fileUrl: dto.fileUrl ?? null,
      name: dto.name ?? null,
      GRNumber: dto.GRNumber ?? null,
      fees: dto.fees ?? null,
      feesStatusChart: dto.feesStatusChart ?? null,
      classSlug: dto.classSlug ?? null,
    });
    const saved = await this.studentRepository.save(student);
    return { success: true, message: 'Student added successfully', data: saved };
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return { ...student, id: student.id, _id: student.id };
  }

  async update(id: string, dto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    if (dto.studentName != null) student.studentName = dto.studentName;
    if (dto.FatherName != null) student.fatherName = dto.FatherName;
    if (dto.fatherName != null) student.fatherName = dto.fatherName;
    if (dto.name != null) student.name = dto.name;
    if (dto.GRNumber != null) student.GRNumber = dto.GRNumber;
    if (dto.fees != null) student.fees = dto.fees;
    if (dto.feesStatusChart != null) student.feesStatusChart = dto.feesStatusChart;
    if (dto.ageGroup != null) student.ageGroup = dto.ageGroup;
    if (dto.grade != null) student.grade = dto.grade;
    if (dto.TshirtSize != null) student.TshirtSize = dto.TshirtSize;
    if (dto.activity != null) student.activity = dto.activity;
    if (dto.status != null) student.status = dto.status;
    if (dto.group != null) student.group = dto.group;
    if (dto.camp != null) student.camp = dto.camp;
    if (dto.subCamp != null) student.subCamp = dto.subCamp;
    if (dto.report != null) student.report = dto.report;
    await this.studentRepository.save(student);
    return { success: true, message: 'Student updated successfully' };
  }

  async delete(id: string) {
    const result = await this.studentRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Student not found');
    return { success: true, message: 'Student deleted successfully.' };
  }

  async filter(dto: FilterStudentsDto) {
    const qb = this.studentRepository.createQueryBuilder('s');
    if (dto.activity)
      qb.andWhere('s.activity ILIKE :activity', { activity: `%${dto.activity}%` });
    if (dto.ageGroup) {
      if (dto.ageGroup === '13-16')
        qb.andWhere('s.age_group IN (:...ages)', { ages: ['13', '14', '15', '16'] });
      else if (dto.ageGroup === '17-20')
        qb.andWhere('s.age_group IN (:...ages)', { ages: ['17', '18', '19', '20'] });
      else qb.andWhere('s.age_group ILIKE :ageGroup', { ageGroup: `%${dto.ageGroup}%` });
    }
    if (dto.campNumber) qb.andWhere('s.camp = :camp', { camp: dto.campNumber });
    if (dto.status) qb.andWhere('s.status ILIKE :status', { status: `%${dto.status}%` });
    if (dto.subCamp)
      qb.andWhere('s.sub_camp ILIKE :subCamp', { subCamp: `%${dto.subCamp}%` });
    if (dto.madrasa) {
      if (dto.madrasa === 'Madrasa Sayyadina Bilal(R.A)')
        qb.andWhere('s.madrasa_name = :madrasa', { madrasa: dto.madrasa });
      else
        qb.andWhere('s.madrasa_name ILIKE :madrasa', { madrasa: `%${dto.madrasa}%` });
    }
    if (dto.tShirtSize)
      qb.andWhere('s.tshirt_size ILIKE :tShirtSize', { tShirtSize: `%${dto.tShirtSize}%` });
    if (dto.group) qb.andWhere('s.group ILIKE :group', { group: `%${dto.group}%` });
    const list = await qb.orderBy('s.created_at', 'DESC').getMany();
    const data = list.map((s) => ({ ...s, id: s.id, _id: s.id }));
    return { success: true, data };
  }

  async findByClassSlug(slug: string) {
    const students = await this.studentRepository.find({
      where: { classSlug: slug },
      order: { createdAt: 'DESC' },
    });
    const data = students.map((s) => ({ ...s, id: s.id, _id: s.id }));
    return data;
  }

  async createForClass(slug: string, dto: CreateStudentDto) {
    const student = this.studentRepository.create({
      ...dto,
      classSlug: slug,
      name: dto.name ?? dto.studentName ?? null,
      fatherName: dto.fatherName ?? dto.FatherName ?? null,
      feesStatusChart: dto.feesStatusChart ?? null,
    });
    const saved = await this.studentRepository.save(student);
    return {
      success: true,
      message: 'Student added successfully',
      data: saved,
      result: saved,
    };
  }
}
