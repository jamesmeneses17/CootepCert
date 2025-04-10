import { Controller, Post, Get, Body } from '@nestjs/common';
import { TiposContratoService } from './tipos-contrato.service';
import { TipoContrato } from './tipo-contrato.entity';

@Controller('tipos-contrato')
export class TiposContratoController {
  constructor(private readonly tiposContratoService: TiposContratoService) {}

  @Post()
  create(@Body() data: Partial<TipoContrato>) {
    return this.tiposContratoService.create(data);
  }

  @Get()
  findAll() {
    return this.tiposContratoService.findAll();
  }
}
