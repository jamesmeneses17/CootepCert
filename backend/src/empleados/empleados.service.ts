import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { DataSource } from 'typeorm';




@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
      private readonly dataSource: DataSource 

  ) {}

  // Crea un nuevo empleado a partir de los datos recibidos

  create(data: Partial<Empleado>) {
    const nuevoEmpleado = this.empleadoRepository.create(data);
    return this.empleadoRepository.save(nuevoEmpleado);
  }

  // Retorna todos los empleados de la base de datos

async findAll() {
  const empleados = await this.empleadoRepository.find({
    relations: [
      'genero',
      'municipioNacimiento',
      'lugarExpedicion',
      'cargo',
      'tipoContrato',
    ],
  });

  const usuarios = await this.dataSource.getRepository(Usuario).find({
    select: ['correo', 'empleadoId'],
  });

  return empleados.map((empleado) => {
    const usuario = usuarios.find((u) => u.empleadoId === empleado.id);
    return {
      ...empleado,
      correo: usuario?.correo ?? null,
    };
  });
}


  // Busca un empleado por su id y retorna el empleado encontrado
  findOne(id: number) {
    return this.empleadoRepository.findOne({
      where: { id },
      relations: [
        'genero',
        'municipioNacimiento',
        'lugarExpedicion',
        'cargo',
        'tipoContrato',
      ],
    });
  }

  // busca un empleado por su id y retorna el empleado encontrado

  update(id: number, data: Partial<Empleado>) {
    return this.empleadoRepository.update(id, data);
  }

  //Eliminar un empleado por su id y retorna el empleado eliminado

  async remove(id: number) {
    const empleado = await this.empleadoRepository.findOne({ where: { id } });
    if (!empleado) return null;
    return this.empleadoRepository.remove(empleado);
  }
}
