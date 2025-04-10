import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargosService } from './cargos.service';
import { CargosController } from './cargos.controller';
import { Cargo } from './cargo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cargo])],
  controllers: [CargosController],
  providers: [CargosService],
})
export class CargosModule {}
