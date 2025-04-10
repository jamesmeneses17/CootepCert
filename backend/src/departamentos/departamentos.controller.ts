import { Controller, Post, Get, Body } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { Departamento } from './departamento.entity';

@Controller('departamentos')
export class DepartamentosController {
  constructor(private readonly departamentosService: DepartamentosService) {}

  @Post()
  create(@Body() data: Partial<Departamento>) {
    return this.departamentosService.create(data);
  }

  @Get()
  findAll() {
    return this.departamentosService.findAll();
  }
}
