import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ IMPORTADO
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EmpleadosModule } from './empleados/empleados.module';
import { CargosModule } from './cargos/cargos.module';
import { GenerosModule } from './generos/generos.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { TiposContratoModule } from './tipos-contrato/tipos-contrato.module';
import { CertificadosModule } from './certificados/certificados.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FuncionesModule } from './funciones/funciones.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ LÍNEA CLAVE
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'certificados_laborales',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    EmpleadosModule,
    CargosModule,
    GenerosModule,
    MunicipiosModule,
    DepartamentosModule,
    TiposContratoModule,
    CertificadosModule,
    UsuariosModule,
    FuncionesModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
