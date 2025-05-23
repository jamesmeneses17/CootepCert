import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';
import { Usuario } from '../usuarios/usuario.entity'; // 👈 Asegúrate de importar esto

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,

    @InjectRepository(Usuario) // 👈 Inyectar repositorio de Usuario
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  create(data: Partial<Empleado>) {
    const nuevoEmpleado = this.empleadoRepository.create(data);
    return this.empleadoRepository.save(nuevoEmpleado);
  }

 findAll() {
  return this.empleadoRepository.find({
    relations: [
      'genero',
      'municipioNacimiento',
      'lugarExpedicion',
      'usuario'
    ],
  });
}


  findOne(id: number) {
  return this.empleadoRepository.findOne({
    where: { id },
    relations: [
      'genero',
      'municipioNacimiento',
      'lugarExpedicion',
      'usuario'
    ],
  });
}


  async update(id: number, data: Partial<Empleado>) {
    const empleado = await this.empleadoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!empleado) throw new Error('Empleado no encontrado');

    // Actualiza campos del empleado
    Object.assign(empleado, data);

    // ✅ Actualiza correo si viene en el payload
    if (data.usuario?.correo && empleado.usuario) {
      empleado.usuario.correo = data.usuario.correo;
      await this.usuarioRepository.save(empleado.usuario); // 👈 importante
    }

    return this.empleadoRepository.save(empleado);
  }

  async remove(id: number) {
    const empleado = await this.empleadoRepository.findOne({ where: { id } });
    if (!empleado) return null;
    return this.empleadoRepository.remove(empleado);
  }
}
