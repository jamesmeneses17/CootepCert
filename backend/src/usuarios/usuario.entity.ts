import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Rol } from '../roles/rol.entity';
import { ManyToOne } from 'typeorm';
import { Empleado } from '../empleados/empleado.entity'; // asegúrate de que exista




// Definicion de la entidad usuario
// Al final de tus imports
import { JoinColumn } from 'typeorm';

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

  @Column({ type: 'timestamp', nullable: true })
  ultimo_reenvio?: Date;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  rol: Rol;

  // 👇 Aquí agregas la columna explicitamente
  @Column({ nullable: true })
  empleadoId: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'empleadoId' }) // asegúrate que coincida con el nombre exacto del campo
  empleado: Empleado;
}
