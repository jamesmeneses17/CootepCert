import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { RolesModule } from 'src/roles/roles.module';
import { Empleado } from '../empleados/empleado.entity'; // IMPORTA LA ENTIDAD

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Empleado]), // INCLÚYELO AQUÍ
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
