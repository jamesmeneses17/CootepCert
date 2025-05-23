import { Content } from 'pdfmake/interfaces';
import { generarPieFirma } from './footer.template';

export function generarContenidoHistorial(
  empleado: any,
  historial: any[]
): Content[] {
  const nombreCompleto = `${empleado.nombres} ${empleado.apellidos}`.toUpperCase();

  const fechaInicioHistorial = historial.length
    ? new Date(historial[0].fecha_inicio)
    : null;

  const fechaFinHistorial = historial.length
    ? new Date(historial[historial.length - 1].fecha_fin)
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

  const listaCargos = historial.map((h: any) => {
    const cargoNombre = h.cargo?.nombre || '[Cargo no definido]';
    const inicio = new Date(h.fecha_inicio).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const fin = h.fecha_fin
      ? new Date(h.fecha_fin).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'la fecha'; // Puedes poner 'actualidad' si quieres
    return `${cargoNombre} del ${inicio} al ${fin}`;
  });

  return [
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
    ...generarPieFirma(),
  ];
}
