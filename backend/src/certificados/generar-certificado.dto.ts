export class GenerarCertificadoDto {
  tipo: 'salario' | 'funciones' | 'historial';
  fechaInicio?: string;
  fechaFin?: string;
}
