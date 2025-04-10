import { Controller, Post, Body, Get } from '@nestjs/common';
import { GenerosService } from './generos.service';
import { Genero } from './genero.entity';

@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Post()
  create(@Body() data: Partial<Genero>) {
    return this.generosService.create(data);
  }

  @Get()
  findAll() {
    return this.generosService.findAll();
  }
}
