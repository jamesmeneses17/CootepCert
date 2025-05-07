import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { CertificadosService } from './certificados.service';
import { Certificado } from './certificado.entity';
import * as fs from 'fs';
import * as path from 'path';

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  @Get(':id/generar')
  async generarPdf(@Param('id') id: string, @Res() res: Response) {
    const data = await this.certificadosService.getCertificadoInfo(+id);

    if (!data) {
      throw new NotFoundException('Certificado no encontrado');
    }

    const { empleado } = data;
    const cargo = empleado.cargo;
    const funciones = cargo.funciones;

    // Leer el logo como base64
    const logoPath = path.join(
      process.cwd(),
      'src',
      'assets',
      'logo_cootep.png',
    );
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const docDefinition = {
      content: [
        {
          columns: [
            {
              image: 'logo',
              width: 80,
            },
            {
              text: [
                {
                  text: 'COOPERATIVA DE LOS TRABAJADORES DE LA EDUCACIÓN Y\nEMPRESARIOS DEL PUTUMAYO\n',
                  style: 'tituloInstitucional',
                },
                {
                  text: 'Personería Jurídica No. 111 del 1 de febrero de 1984 - DANCOOP\nNit.800.173.694-5\n',
                  style: 'subtitulo',
                },
              ],
              alignment: 'center',
              margin: [0, 0, 0, 10],
            },
          ],
        },
        {
          text: 'EL SUSCRITO DIRECTOR DE TALENTO HUMANO DE LA COOPERATIVA DE LOS TRABAJADORES DE LA EDUCACIÓN Y EMPRESARIOS DEL PUTUMAYO “COOTEP”',
          style: 'negritaMayus',
          alignment: 'center',
          margin: [0, 10, 0, 10],
        },
        {
          text: 'HACE CONSTAR',
          style: 'negritaMayus',
          alignment: 'center',
          margin: [0, 10, 0, 20],
        },
        {
          text: `Que el(la) señor(a) ${empleado.nombres} ${empleado.apellidos}, identificado(a) con cédula de ciudadanía No. ${empleado.cedula}, labora en nuestra cooperativa en el cargo de ${cargo.nombre}.`,
          margin: [0, 0, 0, 10],
          fontSize: 11,
        },
        {
          text: 'Entre sus funciones están:',
          style: 'negritaMayus',
          margin: [0, 0, 0, 5],
        },
        {
          ul: funciones.map((f: any) => f.descripcion),
          fontSize: 10,
        },
        {
          text: '\nEste certificado se expide a solicitud del interesado(a).',
          fontSize: 11,
          margin: [0, 20, 0, 0],
        },
      ],
      images: {
        logo: 'data:image/png;base64,' + logoBase64,
      },
      styles: {
        tituloInstitucional: {
          fontSize: 12,
          bold: true,
        },
        subtitulo: {
          fontSize: 10,
          italics: true,
        },
        negritaMayus: {
          fontSize: 11,
          bold: true,
          uppercase: true,
        },
      },
    };

    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer((buffer: Buffer) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=certificado.pdf',
      );
      res.send(buffer);
    });
  }
}
