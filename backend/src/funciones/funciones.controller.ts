import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FuncionesService } from './funciones.service';
import { CreateFuncionDto } from './dto/create-funcion.dto';

@Controller('funciones')
export class FuncionesController {
  constructor(private readonly funcionesService: FuncionesService) {}

  @Post()
  create(@Body() dto: CreateFuncionDto) {
    return this.funcionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.funcionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.funcionesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.funcionesService.remove(+id);
  }
}
