import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from './departamento.entity';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly departamentoRepo: Repository<Departamento>,
  ) {}

  create(data: Partial<Departamento>) {
    const departamento = this.departamentoRepo.create(data);
    return this.departamentoRepo.save(departamento);
  }

  findAll() {
    return this.departamentoRepo.find();
  }
}
