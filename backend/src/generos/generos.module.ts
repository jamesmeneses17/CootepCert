import { Module } from '@nestjs/common';
import { GenerosController } from './generos.controller';
import { GenerosService } from './generos.service';

@Module({
  controllers: [GenerosController],
  providers: [GenerosService]
})
export class GenerosModule {}
