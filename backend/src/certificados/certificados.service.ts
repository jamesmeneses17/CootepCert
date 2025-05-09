import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificado } from './certificado.entity';
import { NotFoundException } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

// Importar pdfMake para generar PDFs

const pdfMake = require('pdfmake/build/pdfmake'); // Importa el code de pdfMake
const pdfFonts = require('pdfmake/build/vfs_fonts'); // Importa las fuentes de pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs; // Asigna las fuentes a pdfMake

@Injectable()
export class CertificadosService {
  constructor(
    @InjectRepository(Certificado)
    private readonly certificadoRepo: Repository<Certificado>,
  ) {}

  create(data: Partial<Certificado>) {
    const certificado = this.certificadoRepo.create(data);
    return this.certificadoRepo.save(certificado);
  }

  findAll() {
    return this.certificadoRepo.find({ relations: ['empleado'] });
  }

  findOne(id: number) {
    return this.certificadoRepo.findOne({
      where: { id },
      relations: ['empleado'],
    });
  }

  update(id: number, data: Partial<Certificado>) {
    return this.certificadoRepo.update(id, data);
  }

  async remove(id: number) {
    const certificado = await this.certificadoRepo.findOne({ where: { id } });
    if (!certificado) return null;
    return this.certificadoRepo.remove(certificado);
  }

  async getCertificadoInfo(id: number) {
    return this.certificadoRepo.findOne({
      where: { id },
      relations: [
        'empleado',
        'empleado.cargo',
        'empleado.cargo.funciones',
      ],
    });
  }

async generarPdfBuffer(id: number): Promise<Buffer> {
  const data = await this.getCertificadoInfo(id);

  if (!data) {
    throw new NotFoundException('Certificado no encontrado');
  }

  const { empleado } = data;
  const cargo = empleado.cargo;
  const funciones = cargo.funciones;

  const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo_cootep.png');
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

  return new Promise((resolve) => {
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer((buffer: Buffer) => {
      resolve(buffer);
    });
  });
}

  

}
