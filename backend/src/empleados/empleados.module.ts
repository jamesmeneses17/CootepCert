import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { Empleado } from './empleado.entity';
import { Usuario } from 'src/usuarios/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado, Usuario])
],
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
})
export class EmpleadosModule {}
