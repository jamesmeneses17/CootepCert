import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Municipio } from './municipio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(Municipio)
    private readonly municipioRepo: Repository<Municipio>,
  ) {}

  create(data: Partial<Municipio>) {
    const municipio = this.municipioRepo.create(data);
    return this.municipioRepo.save(municipio);
  }

  findAll() {
    return this.municipioRepo.find({ relations: ['departamento'] });
  }
}
