import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cargo } from '../cargos/cargo.entity';

@Entity('funciones')
export class Funcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  descripcion: string;

  @ManyToOne(() => Cargo, cargo => cargo.funciones, { onDelete: 'CASCADE' })
  cargo: Cargo;
}
