import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genero } from './genero.entity';

@Injectable()
export class GenerosService {
  constructor(
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  create(data: Partial<Genero>) {
    const genero = this.generoRepository.create(data);
    return this.generoRepository.save(genero);
  }

  findAll() {
    return this.generoRepository.find();
  }
}
