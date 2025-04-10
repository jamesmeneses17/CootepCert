import { Controller, Post, Get, Body } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { Municipio } from './municipio.entity';

@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Post()
  create(@Body() data: Partial<Municipio>) {
    return this.municipiosService.create(data);
  }

  @Get()
  findAll() {
    return this.municipiosService.findAll();
  }
}
