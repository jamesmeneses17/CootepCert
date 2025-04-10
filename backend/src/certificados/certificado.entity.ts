import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Empleado } from '../empleados/empleado.entity';
  
  @Entity('certificados')
  export class Certificado {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'date' })
    fecha_emision: Date;
  
    @Column('text')
    descripcion: string;
  
    @ManyToOne(() => Empleado, empleado => empleado.certificados)
    @JoinColumn({ name: 'empleado_id' })
    empleado: Empleado;
  }
  