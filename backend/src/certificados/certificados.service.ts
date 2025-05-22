import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificado } from './certificado.entity';
import { NotFoundException } from '@nestjs/common';
import { generarContenidoSalario } from './pdf-templates/tipo-salario.template';
import { generarContenidoFunciones } from './pdf-templates/tipo-funciones.template';
import { generarContenidoHistorial } from './pdf-templates/tipo-historial.template';
import { generarEncabezadoPDF } from './pdf-templates/header.template';



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
    fechas?: { fechaInicio?: string; fechaFin?: string },
  ): Promise<Buffer> {
    const data = await this.certificadoRepo.findOne({
      where: { empleado: { id: empleadoId } },
      relations: [
        'empleado',
        'empleado.cargo',
        'empleado.cargo.funciones',
        'empleado.historial',
        'empleado.historial.cargo',
      ],
    });


    if (!data || !data.empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const { empleado } = data;
    const cargo = empleado.cargo;
    const funciones = cargo?.funciones || [];

    // Cargar logo
    const logoPath = path.join(
      process.cwd(),
      'src',
      'assets',
      'logo_cootep.png',
    );
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const content: any[] = [...generarEncabezadoPDF()];


    // 🔁 Agregar contenido según el tipo solicitado
    if (tipo === 'salario') {
      content.push(...generarContenidoSalario(empleado));
    }


    if (tipo === 'funciones') {
      content.push(...generarContenidoFunciones(empleado, funciones));
    }

    if (tipo === 'historial') {
      const contenidoHistorial = generarContenidoHistorial(empleado, fechas);
      content.push(...contenidoHistorial);
    }



    const firmaPath = path.join(process.cwd(), 'src', 'assets', 'firma.png');
    const firmaBase64 = fs.readFileSync(firmaPath).toString('base64');


    // Crear PDF
    const docDefinition = {
      content,
      images: {
        logo: 'data:image/png;base64,' + logoBase64,
        firma: 'data:image/png;base64,' + firmaBase64,
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
