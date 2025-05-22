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
      const nombreCompleto =
        `${empleado.nombres} ${empleado.apellidos}`.toUpperCase();
      const fechaIngreso = new Date(empleado.fecha_ingreso);
      const fechaIngresoTexto = fechaIngreso.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const salarioFormateado = empleado.salario
        ? `$ ${Number(empleado.salario).toLocaleString('es-CO')}`
        : '[salario no disponible]';

      const fechaVencimiento = new Date(fechaIngreso);
      fechaVencimiento.setFullYear(fechaIngreso.getFullYear() + 1);
      const fechaVencimientoTexto = fechaVencimiento.toLocaleDateString(
        'es-CO',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      );

      const hoy = new Date();
      const fechaHoyTexto = hoy.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      content.push(
        {
          text: `Que ${nombreCompleto}, identificado(a) con cédula de ciudadanía No. ${empleado.cedula}, presta sus servicios en nuestra Cooperativa, desde el día ${fechaIngresoTexto}, actualmente se desempeña en el cargo de ${empleado.cargo?.nombre || '[cargo]'}, con una asignación básica salarial de ${salarioFormateado}, menos los descuentos de ley, con contrato a término fijo de un (1) año, el cual vence el ${fechaVencimientoTexto}.`,
          fontSize: 11,
          margin: [0, 0, 0, 20],
        },
        {
          text: `Para constancia se firma en Mocoa, el día ${fechaHoyTexto}.`,
          fontSize: 11,
          margin: [0, 0, 0, 30],
        },
        {
          image: 'firma',
          width: 150,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'JONATHAN MAURICIO PEJENDINO ROSERO',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Director de Talento Humano – COOTEP',
          alignment: 'center',
        },
      );
    }

    if (tipo === 'funciones') {
      const nombreCompleto = `${empleado.nombres} ${empleado.apellidos}`.toUpperCase();
      const fechaIngreso = new Date(empleado.fecha_ingreso);
      const fechaTexto = fechaIngreso.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const hoy = new Date();
      const fechaHoyTexto = hoy.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const funcionesData = funciones.length
        ? funciones.map((f: any, i: number) => [String(i + 1), f.descripcion])
        : [['-', '[Sin funciones registradas]']];

      content.push(
        {
          text: `Que ${nombreCompleto}, identificado(a) con cédula de ciudadanía No. ${empleado.cedula} de Mocoa, presta sus servicios en nuestra Cooperativa, desde el día ${fechaTexto} hasta la fecha. Actualmente se desempeña en el cargo de ${empleado.cargo?.nombre || '[cargo]'}, con contrato a término fijo de un año que vence el día ${fechaTexto}, desarrollando las siguientes funciones:`,
          fontSize: 11,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'FUNCIONES DEL CARGO',
          style: 'negritaMayus',
          alignment: 'center',
          margin: [0, 0, 0, 6],
        },
        {
          table: {
            widths: ['auto', '*'],
            body: [
              [
                { text: 'N°', bold: true, alignment: 'center' },
                { text: 'Descripción de la función', bold: true },
              ],
              ...funcionesData,
            ],
          },
          fontSize: 9,
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },
        {
          text: `Para constancia se firma en Mocoa, el día ${fechaHoyTexto}.`,
          fontSize: 11,
          margin: [0, 0, 0, 20],
        },
        {
          image: 'firma',
          width: 150,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'JONATHAN MAURICIO PEJENDINO ROSERO',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Director de Talento Humano – COOTEP',
          alignment: 'center',
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

      const nombreCompleto = `${empleado.nombres} ${empleado.apellidos}`.toUpperCase();
      const fechaInicioHistorial = historialFiltrado.length
        ? new Date(historialFiltrado[0].fecha_inicio)
        : null;
      const fechaFinHistorial = historialFiltrado.length
        ? new Date(historialFiltrado[historialFiltrado.length - 1].fecha_fin)
        : null;

      const fechaInicioTexto = fechaInicioHistorial?.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const fechaFinTexto = fechaFinHistorial?.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const hoy = new Date();
      const fechaHoyTexto = hoy.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const listaCargos = historialFiltrado.map((h: any) => {
        const cargoNombre = h.cargo?.nombre || '[Cargo no definido]';
        const inicio = new Date(h.fecha_inicio).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
        const fin = new Date(h.fecha_fin).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
        return `${cargoNombre} del ${inicio} al ${fin}`;
      });

      content.push(
        {
          text: `Que el(la) señor(a) ${nombreCompleto}, identificado(a) con cédula de ciudadanía No. ${empleado.cedula} de Mocoa, prestó sus servicios en nuestra Cooperativa desde el ${fechaInicioTexto} hasta el ${fechaFinTexto}, desempeñando los siguientes cargos:`,
          fontSize: 11,
          margin: [0, 0, 0, 10],
        },
        {
          ul: listaCargos.length ? listaCargos : ['[Sin historial disponible]'],
          fontSize: 10,
          margin: [0, 0, 0, 20],
        },
        {
          text: `Para constancia se firma en Mocoa, el día ${fechaHoyTexto}.`,
          fontSize: 11,
          margin: [0, 0, 0, 20],
        },
        {
          image: 'firma',
          width: 150,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'JONATHAN MAURICIO PEJENDINO ROSERO',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Director de Talento Humano – COOTEP',
          alignment: 'center',
        }
      );
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
