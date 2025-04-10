import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoContrato } from './tipo-contrato.entity';
import { TiposContratoService } from './tipos-contrato.service';
import { TiposContratoController } from './tipos-contrato.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoContrato])],
  controllers: [TiposContratoController],
  providers: [TiposContratoService],
})
export class TiposContratoModule {}
