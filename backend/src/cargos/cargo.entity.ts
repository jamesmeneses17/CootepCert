import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from '../empleados/empleado.entity';
import { Funcion } from '../funciones/funcion.entity';
import { HistorialEmpleado } from 'src/historial-empleado/historial-empleado.entity';

@Entity('cargos')
export class Cargo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  
@OneToMany(() => HistorialEmpleado, (historial) => historial.cargo)
historiales: HistorialEmpleado[];

@OneToMany(() => Funcion, (funcion) => funcion.cargo)
funciones: Funcion[];

}
