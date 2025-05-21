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
import { GenerarCertificadoDto } from './generar-certificado.dto';

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

  // ✅ Único endpoint para generar certificado (salario, funciones o historial)
  @Post(':id/generar')
  async generarCertificado(
    @Param('id') id: number,
    @Body() body: GenerarCertificadoDto,
    @Res() res: Response
  ) {
    const buffer = await this.certificadosService.generarPdfBufferPorTipo(
      id,
      body.tipo,
      { fechaInicio: body.fechaInicio, fechaFin: body.fechaFin }
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=certificado_laboral.pdf',
    });

    res.send(buffer);
  }
}
