import { Controller, Post, Get, Body } from '@nestjs/common';
import { CargosService } from './cargos.service';
import { Cargo } from './cargo.entity';

@Controller('cargos')
export class CargosController {
  constructor(private readonly cargosService: CargosService) {}

  @Post()
  create(@Body() data: Partial<Cargo>) {
    return this.cargosService.create(data);
  }

  @Get()
  findAll() {
    return this.cargosService.findAll();
  }
}
