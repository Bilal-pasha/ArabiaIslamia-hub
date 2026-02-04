import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Madrasa, ScoutsStudent } from '@arabiaaislamia/database';
import { CreateMadrasaDto } from './dto/create-madrasa.dto';

@Injectable()
export class MadrasasService {
  constructor(
    @InjectRepository(Madrasa)
    private readonly madrasaRepository: Repository<Madrasa>,
    @InjectRepository(ScoutsStudent)
    private readonly studentRepository: Repository<ScoutsStudent>,
  ) { }

  async getNames(): Promise<string[]> {
    const madrasas = await this.madrasaRepository.find({
      select: ['madrasaName'],
      order: { madrasaName: 'ASC' },
    });
    return madrasas.map((m) => m.madrasaName);
  }

  async create(dto: CreateMadrasaDto) {
    const madrasa = this.madrasaRepository.create({
      madrasaName: dto.madrasaName,
      madrasaAddress: dto.madrasaAddress ?? null,
      totalStudents: dto.totalStudents ?? 0,
      userId: dto.userId,
      contactPersonName: dto.contactPersonName ?? null,
      cellNumber: dto.cellNumber ?? null,
      status: 'Pending',
    });
    const saved = await this.madrasaRepository.save(madrasa);
    return { success: true, message: 'Madrasa registered successfully', data: saved };
  }

  async findByUserOrAdmin(id: string, userId: string) {
    const isAdmin = id === 'admin';
    const madrasas = await this.madrasaRepository.find({
      where: isAdmin ? {} : { userId },
      order: { createdAt: 'DESC' },
    });
    const madrasaIds = madrasas.map((m) => m.id);
    const students = madrasaIds.length
      ? await this.studentRepository
        .createQueryBuilder('s')
        .select('s.madrasaId', 'madrasaId')
        .addSelect('COUNT(*)', 'count')
        .where('s.madrasaId IN (:...ids)', { ids: madrasaIds })
        .groupBy('s.madrasaId')
        .getRawMany()
      : [];
    const countByMadrasa = Object.fromEntries(
      students.map((r: { madrasaId: string; count: string }) => [
        r.madrasaId,
        parseInt(r.count, 10),
      ]),
    );
    const data = madrasas.map((m) => ({
      ...m,
      id: m.id,
      _id: m.id,
      registeredStudents: countByMadrasa[m.id] ?? 0,
    }));
    return { success: true, data };
  }

  async updateStatus(id: string, status: string) {
    const result = await this.madrasaRepository.update({ id }, { status });
    if (result.affected === 0) throw new NotFoundException('Madrasa not found');
    return { success: true, message: 'Madrasa status updated successfully' };
  }

  async delete(id: string) {
    const result = await this.madrasaRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Madrasa not found');
    return { success: true, message: 'Madrasa deleted successfully' };
  }

  async getStudentsByMadrasaId(madrasaId: string) {
    const students = await this.studentRepository.find({
      where: { madrasaId },
      order: { createdAt: 'DESC' },
    });
    const data = students.map((s) => ({ ...s, id: s.id, _id: s.id }));
    return { students: data };
  }
}
