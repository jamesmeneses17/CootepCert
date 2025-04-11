import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcion } from './funcion.entity';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { Cargo } from '../cargos/cargo.entity';

@Injectable()
export class FuncionesService {
  constructor(
    @InjectRepository(Funcion)
    private readonly funcionRepo: Repository<Funcion>,

    @InjectRepository(Cargo)
    private readonly cargoRepo: Repository<Cargo>,
  ) {}

  async create(createFuncionDto: CreateFuncionDto) {
    const cargo = await this.cargoRepo.findOneBy({ id: createFuncionDto.cargoId });

    if (!cargo) {
      throw new Error('Cargo not found');
    }

    const funcion = this.funcionRepo.create({
      descripcion: createFuncionDto.descripcion,
      cargo,
    });

    return this.funcionRepo.save(funcion);
  }

  findAll() {
    return this.funcionRepo.find({ relations: ['cargo'] });
  }

  findOne(id: number) {
    return this.funcionRepo.findOne({ where: { id }, relations: ['cargo'] });
  }

  remove(id: number) {
    return this.funcionRepo.delete(id);
  }
}
