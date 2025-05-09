import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  // Crea un nuevo empleado a partir de los datos recibidos

  create(data: Partial<Empleado>) {
    const nuevoEmpleado = this.empleadoRepository.create(data);
    return this.empleadoRepository.save(nuevoEmpleado);
  }

  // Retorna todos los empleados de la base de datos

  findAll() {
    return this.empleadoRepository.find({
      relations: [
        'genero',
        'municipioNacimiento',
        'lugarExpedicion',
        'cargo',
        'tipoContrato',
      ],
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
