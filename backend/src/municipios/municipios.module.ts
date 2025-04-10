import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipio } from './municipio.entity';
import { MunicipiosService } from './municipios.service';
import { MunicipiosController } from './municipios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Municipio])],
  controllers: [MunicipiosController],
  providers: [MunicipiosService],
})
export class MunicipiosModule {}
