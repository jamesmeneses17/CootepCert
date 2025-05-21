import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialEmpleado } from './historial-empleado.entity';
import { HistorialEmpleadoService } from './historial-empleado.service';
import { HistorialEmpleadoController } from './historial-empleado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialEmpleado])],
  providers: [HistorialEmpleadoService],
  controllers: [HistorialEmpleadoController],
  exports: [TypeOrmModule],
})
export class HistorialEmpleadoModule {}
