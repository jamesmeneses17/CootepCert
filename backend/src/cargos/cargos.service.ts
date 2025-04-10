import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from './cargo.entity';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo)
    private readonly cargoRepository: Repository<Cargo>,
  ) {}

  create(data: Partial<Cargo>) {
    const nuevoCargo = this.cargoRepository.create(data);
    return this.cargoRepository.save(nuevoCargo);
  }

  findAll() {
    return this.cargoRepository.find();
  }
}
