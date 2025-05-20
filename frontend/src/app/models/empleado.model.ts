export interface Empleado {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
    correo: string; 

  fecha_nacimiento: string;
  fecha_ingreso: string;
  genero: { id: number; nombre: string };
  municipioNacimiento: { id: number; nombre: string };
  lugarExpedicion: { id: number; nombre: string };
  cargo: { id: number; nombre: string };
  tipoContrato: { id: number; nombre: string };
}
