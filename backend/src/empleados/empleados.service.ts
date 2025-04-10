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

  create(data: Partial<Empleado>) {
    const nuevoEmpleado = this.empleadoRepository.create(data);
    return this.empleadoRepository.save(nuevoEmpleado);
  }

  findAll() {
    return this.empleadoRepository.find({
      relations: ['genero', 'municipioNacimiento', 'lugarExpedicion', 'cargo', 'tipoContrato'],
    });
  }

  findOne(id: number) {
    return this.empleadoRepository.findOne({
      where: { id },
      relations: ['genero', 'municipioNacimiento', 'lugarExpedicion', 'cargo', 'tipoContrato'],
    });
  }

  update(id: number, data: Partial<Empleado>) {
    return this.empleadoRepository.update(id, data);
  }

  async remove(id: number) {
    const empleado = await this.empleadoRepository.findOne({ where: { id } });
    if (!empleado) return null;
    return this.empleadoRepository.remove(empleado);
  }
}
