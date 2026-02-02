import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { SubmitAdmissionDto } from './dto/submit-admission.dto';

@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post('submit')
  async submit(@Body() dto: SubmitAdmissionDto) {
    return this.admissionService.submit(dto);
  }

  @Get()
  async findAll() {
    return this.admissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.admissionService.findOne(id);
  }
}
