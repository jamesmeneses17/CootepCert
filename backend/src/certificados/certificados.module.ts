import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificado } from './certificado.entity';
import { CertificadosService } from './certificados.service';
import { CertificadosController } from './certificados.controller';
import { HistorialEmpleado } from 'src/historial-empleado/historial-empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificado, HistorialEmpleado])],
  controllers: [CertificadosController],
  providers: [CertificadosService],
})
export class CertificadosModule {}
