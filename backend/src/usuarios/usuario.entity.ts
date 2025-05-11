import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Rol } from '../roles/rol.entity';
import { ManyToOne } from 'typeorm';

// Definicion de la entidad usuario
@Entity('usuarios')
export class Usuario {
  // Clave primaria autoincremental
  @PrimaryGeneratedColumn()
  id: number;

  // Correo de usuario deber ser unico
  @Column({ unique: true })
  correo: string;

  // Cedula de usuario deber ser unico
  @Column({ unique: true })
  cedula: string;

  //Codigo de verificacion para el registro de usuario
  @Column({ nullable: true })
  codigo_verificacion: string;

  // Fecha y hora de expiracion del codigo de verificacion
  @Column({ type: 'timestamp', nullable: true })
  codigo_expira: Date;

  // Campo para controlar el ultimo reenvio del codigo de verificacion

  @Column({ type: 'timestamp', nullable: true })
  ultimo_reenvio?: Date;

  //Relacion con la entidad ROL, muchos usuarios pueden tener el mismo rol
  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  rol: Rol;
}
