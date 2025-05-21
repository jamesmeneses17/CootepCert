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
  ) { }

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

  //Metodo que busca un certificado por id y trae la info del empleado

  async getCertificadoInfo(id: number) {
    return this.certificadoRepo.findOne({
      where: { id }, // Busca el certificado por ID
      relations: [
        // Relaciones del empleado
        'empleado',
        'empleado.cargo',
        'empleado.cargo.funciones',
      ],
    });
  }

  // Generar el PDF como buffer con la información del empleado
async generarPdfBufferPorTipo(
  empleadoId: number,
  tipo: 'salario' | 'funciones' | 'historial',
  fechas?: { fechaInicio?: string; fechaFin?: string }
): Promise<Buffer> {
  const data = await this.certificadoRepo.findOne({
    where: { empleado: { id: empleadoId } },
    relations: [
      'empleado',
      'empleado.cargo',
      'empleado.cargo.funciones',
      'empleado.historial',
    ],
  });

  if (!data || !data.empleado) {
    throw new NotFoundException('Empleado no encontrado');
  }

  const { empleado } = data;
  const cargo = empleado.cargo;
  const funciones = cargo?.funciones || [];

  // Cargar logo
  const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo_cootep.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');

  const content: any[] = [
    {
      columns: [
        { image: 'logo', width: 80 },
        {
          text: [
            {
              text: 'COOPERATIVA DE LOS TRABAJADORES DE LA EDUCACIÓN Y EMPRESARIOS DEL PUTUMAYO\n',
              style: 'tituloInstitucional',
            },
            {
              text: 'Personería Jurídica No. 111 del 1 de febrero de 1984 - DANCOOP\nNit.800.173.694-5\n\n',
              style: 'subtitulo',
            },
          ],
          alignment: 'center',
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
  ];

  // 🔁 Agregar contenido según el tipo solicitado
  if (tipo === 'salario') {
    content.push({
      text: `Que el(la) señor(a) ${empleado.nombres} ${empleado.apellidos}, identificado(a) con cédula No. ${empleado.cedula}, labora en nuestra cooperativa desde ${empleado.fecha_ingreso
 || '[fecha]'}, actualmente en el cargo de ${cargo?.nombre}, con una asignación salarial de $${empleado.salario || '[salario]'}.`,
      margin: [0, 0, 0, 10],
    });
  }

  if (tipo === 'funciones') {
    content.push(
      {
        text: 'Entre sus funciones están:',
        style: 'negritaMayus',
        margin: [0, 10, 0, 5],
      },
      {
        ul: funciones.map((f: any) => f.descripcion) || ['[Sin funciones registradas]'],
        fontSize: 10,
      }
    );
  }

  if (tipo === 'historial') {
    const historial = empleado.historial || [];

    const historialFiltrado = historial.filter((h: any) => {
      const desde = new Date(h.fecha_inicio);
      const hasta = new Date(h.fecha_fin);
      const inicio = fechas?.fechaInicio ? new Date(fechas.fechaInicio) : null;
      const fin = fechas?.fechaFin ? new Date(fechas.fechaFin) : null;
      return (!inicio || hasta >= inicio) && (!fin || desde <= fin);
    });

    const lista = historialFiltrado.map((h: any) => {
      return `${h.cargo} (${h.fecha_inicio} a ${h.fecha_fin})`;
    });

    content.push({
      text: 'Historial de cargos desempeñados:',
      style: 'negritaMayus',
      margin: [0, 10, 0, 5],
    });
    content.push({
      ul: lista.length ? lista : ['[Sin historial disponible]'],
      fontSize: 10,
    });
  }

  content.push({
    text: '\nEste certificado se expide a solicitud del interesado(a).',
    fontSize: 11,
    margin: [0, 20, 0, 0],
  });

  // Crear PDF
  const docDefinition = {
    content,
    images: {
      logo: 'data:image/png;base64,' + logoBase64,
    },
    styles: {
      tituloInstitucional: { fontSize: 12, bold: true },
      subtitulo: { fontSize: 10, italics: true },
      negritaMayus: { fontSize: 11, bold: true, uppercase: true },
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
