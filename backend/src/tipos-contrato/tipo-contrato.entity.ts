import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from '../empleados/empleado.entity';

@Entity('tipos_contrato')
export class TipoContrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @OneToMany(() => Empleado, empleado => empleado.tipoContrato)
  empleados: Empleado[];
}
