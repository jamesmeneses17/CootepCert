import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Departamento } from '../departamentos/departamento.entity';
import { Empleado } from '../empleados/empleado.entity';

@Entity('municipios')
export class Municipio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @ManyToOne(() => Departamento, departamento => departamento.municipios)
  departamento: Departamento;

  @OneToMany(() => Empleado, empleado => empleado.municipioNacimiento)
  empleadosNacimiento: Empleado[];

  @OneToMany(() => Empleado, empleado => empleado.lugarExpedicion)
  empleadosExpedicion: Empleado[];
}
