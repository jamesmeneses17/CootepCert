import { Content } from 'pdfmake/interfaces';
import { generarPieFirma } from './footer.template';

export function generarContenidoSalario(
  empleado: any,
  historial: any[]
): Content[] {
  const nombreCompleto = `${empleado.nombres} ${empleado.apellidos}`.toUpperCase();

  const ultimoHistorial = historial[historial.length - 1];
  const primerHistorial = historial[0];

  const fechaIngreso = new Date(primerHistorial?.fecha_inicio);
  const fechaIngresoTexto = fechaIngreso.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const salarioFormateado = ultimoHistorial?.salario
    ? `$ ${Number(ultimoHistorial.salario).toLocaleString('es-CO')}`
    : '[salario no disponible]';

  const cargoActual = ultimoHistorial?.cargo?.nombre || '[cargo no disponible]';

  const fechaVencimiento = new Date(primerHistorial?.fecha_inicio);
  fechaVencimiento.setFullYear(fechaIngreso.getFullYear() + 1);
  const fechaVencimientoTexto = fechaVencimiento.toLocaleDateString('es-CO', {
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

  return [
    {
      text: `Que ${nombreCompleto}, identificado(a) con cédula de ciudadanía No. ${empleado.cedula}, presta sus servicios en nuestra Cooperativa, desde el día ${fechaIngresoTexto}, actualmente se desempeña en el cargo de ${cargoActual}, con una asignación básica salarial de ${salarioFormateado}, menos los descuentos de ley, con contrato a término fijo de un (1) año, el cual vence el ${fechaVencimientoTexto}.`,
      fontSize: 11,
      margin: [0, 0, 0, 20],
    },
    {
      text: `Para constancia se firma en Mocoa, el día ${fechaHoyTexto}.`,
      fontSize: 11,
      margin: [0, 0, 0, 30],
    },
    ...generarPieFirma(),
  ];
}
