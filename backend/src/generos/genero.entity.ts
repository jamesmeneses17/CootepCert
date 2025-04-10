import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from '../empleados/empleado.entity';

@Entity('generos')
export class Genero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @OneToMany(() => Empleado, empleado => empleado.genero)
  empleados: Empleado[];
}
