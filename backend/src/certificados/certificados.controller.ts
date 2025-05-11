import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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

  // Endpoint para generar y descargar el PDF del certificado

  @Get(':id/generar')
  async generarPdf(@Param('id') id: string, @Res() res: Response) {
    // Genera el PDF y lo guarda en un buffer
    const buffer = await this.certificadosService.generarPdfBuffer(+id);

    //Configura los headers para la descarga del PDF

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=certificado.pdf',
    );
    // Envía el buffer como respuesta
    res.send(buffer);
  }
}
