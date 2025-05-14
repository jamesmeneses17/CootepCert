export interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  fecha_ingreso: string;
  genero: { id: number };
  municipioNacimiento: { id: number };
  lugarExpedicion: { id: number };
  cargo: { id: number };
  tipoContrato: { id: number };
}
