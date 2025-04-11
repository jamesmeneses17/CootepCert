import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncionesService } from './funciones.service';
import { FuncionesController } from './funciones.controller';
import { Funcion } from './funcion.entity';
import { Cargo } from '../cargos/cargo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funcion, Cargo])],
  controllers: [FuncionesController],
  providers: [FuncionesService],
})
export class FuncionesModule {}
