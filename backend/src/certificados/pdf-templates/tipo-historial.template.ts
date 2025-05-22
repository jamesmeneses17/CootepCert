import { Content } from 'pdfmake/interfaces';
import { generarPieFirma } from './footer.template';


export function generarContenidoHistorial(
  empleado: any,
  fechas?: { fechaInicio?: string; fechaFin?: string }
): Content[] {
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
      ...generarPieFirma()

  ];
}
