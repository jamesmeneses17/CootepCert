export interface Empleado {
historial: any;
historialEmpleado: any;
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
  tipoContrato: { id: number; nombre: string };
  // 👇 Agrega estas dos si aún no las tienes
  cargo?: any;
  fechaIngresoActual?: string;
  
}
