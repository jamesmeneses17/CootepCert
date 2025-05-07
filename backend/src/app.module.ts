import { Module } from '@nestjs/common';

// Modulo para manejar variables de entorno
import { ConfigModule } from '@nestjs/config';

// Modulo o libreria para conectar a la base de datos usando TypeORM
// es la que permite la conexión a la base de datos
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modulos de funcionalidades de la aplicacion (entidades del sistema)
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
    //Carga variables de entorno desde el archivo .env
    ConfigModule.forRoot({ isGlobal: true }),

    //Conexion a la base de datos usando TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'certificados_laborales',
      // Busca todas las entidades en la carpeta dist y las compila
      entities: ['dist/**/*.entity{.ts,.js}'],
      // Genera la base de datos si no existe
      synchronize: true,
    }),

    // Importacion de todos los modulos funcionales
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
  //Controlador raiz de la aplicacion
  controllers: [AppController],
  //Servicio raiz de la aplicacion
  providers: [AppService],
})
export class AppModule {}
