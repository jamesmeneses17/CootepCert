import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoContrato } from './tipo-contrato.entity';

@Injectable()
export class TiposContratoService {
  constructor(
    @InjectRepository(TipoContrato)
    private readonly tipoContratoRepo: Repository<TipoContrato>,
  ) {}

  create(data: Partial<TipoContrato>) {
    const tipo = this.tipoContratoRepo.create(data);
    return this.tipoContratoRepo.save(tipo);
  }

  findAll() {
    return this.tipoContratoRepo.find();
  }
}
