import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';
  import { CertificadosService } from './certificados.service';
  import { Certificado } from './certificado.entity';
  
  @Controller('certificados')
  export class CertificadosController {
    constructor(private readonly certificadosService: CertificadosService) {}
  
    @Post()
    create(@Body() data: Partial<Certificado>) {
      return this.certificadosService.create(data);
    }
  
    @Get()
    findAll() {
      return this.certificadosService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.certificadosService.findOne(+id);
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Certificado>) {
      return this.certificadosService.update(+id, data);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.certificadosService.remove(+id);
    }
  }
  