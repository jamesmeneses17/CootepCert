import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Municipio } from '../municipios/municipio.entity';
import { Genero } from '../generos/genero.entity';
import { Cargo } from '../cargos/cargo.entity';
import { TipoContrato } from '../tipos-contrato/tipo-contrato.entity';
import { Certificado } from '../certificados/certificado.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  cedula: string;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ type: 'date' })
  fecha_nacimiento: Date;

  @Column({ type: 'date' })
  fecha_ingreso: Date;

  @ManyToOne(() => Genero)
  @JoinColumn({ name: 'genero_id' })
  genero: Genero;

  @ManyToOne(() => Municipio)
  @JoinColumn({ name: 'municipio_nacimiento_id' })
  municipioNacimiento: Municipio;

  @ManyToOne(() => Municipio)
  @JoinColumn({ name: 'lugar_expedicion_id' })
  lugarExpedicion: Municipio;

  @ManyToOne(() => Cargo)
  @JoinColumn({ name: 'cargo_id' })
  cargo: Cargo;

  @ManyToOne(() => TipoContrato)
  @JoinColumn({ name: 'tipo_contrato_id' })
  tipoContrato: TipoContrato;

  @OneToMany(() => Certificado, (certificado) => certificado.empleado)
  certificados: Certificado[];

  // ✅ Relación con Usuario (necesaria para acceder a `empleado.usuario.correo`)
  @OneToOne(() => Usuario, (usuario) => usuario.empleado)
  usuario: Usuario;
  
}
