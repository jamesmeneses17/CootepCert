import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from '../empleados/empleado.entity';
import { Funcion } from '../funciones/funcion.entity';

@Entity('cargos')
export class Cargo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @OneToMany(() => Empleado, empleado => empleado.cargo)
  empleados: Empleado[];

  @OneToMany(() => Funcion, funcion => funcion.cargo)
funciones: Funcion[];
}
