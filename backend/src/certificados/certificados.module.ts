import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificado } from './certificado.entity';
import { CertificadosService } from './certificados.service';
import { CertificadosController } from './certificados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Certificado])],
  controllers: [CertificadosController],
  providers: [CertificadosService],
})
export class CertificadosModule {}
