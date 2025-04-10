import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  correo: string;

  @Column({ unique: true })
  cedula: string;

  @Column({ nullable: true })
  codigo_verificacion: string;

  @Column({ type: 'timestamp', nullable: true })
  codigo_expira: Date;
}
