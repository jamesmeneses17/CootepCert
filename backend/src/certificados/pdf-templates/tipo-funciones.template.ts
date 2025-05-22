// src/certificados/pdf-templates/tipo-funciones.template.ts
import { Content } from 'pdfmake/interfaces';
import { generarPieFirma } from './footer.template';


export function generarContenidoFunciones(empleado: any, funciones: any[]): Content[] {
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

  return [
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
            { text: 'Nº', bold: true, alignment: 'center' },
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
   ...generarPieFirma()

  ];
}
