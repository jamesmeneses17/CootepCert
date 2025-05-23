import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empleado } from '../empleados/empleado.entity';
import { Cargo } from '../cargos/cargo.entity';
import { TipoContrato } from '../tipos-contrato/tipo-contrato.entity';

@Entity('historial_empleado')
export class HistorialEmpleado {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Empleado, (empleado) => empleado.historial)
  @JoinColumn({ name: 'empleado_id' })
  empleado: Empleado;

@ManyToOne(() => Cargo, (cargo) => cargo.historiales)
@JoinColumn({ name: 'cargo_id' })
cargo: Cargo;


  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  salario: number;

  @ManyToOne(() => TipoContrato)
  @JoinColumn({ name: 'tipo_contrato_id' })
  tipoContrato: TipoContrato;

  @Column({ type: 'text', nullable: true })
  descripcion_funciones: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  
}
