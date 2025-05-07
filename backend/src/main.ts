import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Crea la aplicacion NestJS
  const app = await NestFactory.create(AppModule);

  // Habilita peticiones desde el frontend
  app.enableCors({
    origin: 'http://localhost:4200',
  });

  // Usa una validacion de datos para las peticiones
  //  transforma los datos a un formato adecuado

  app.useGlobalPipes(new ValidationPipe());

  // Inicia el servidor en el puerto 3000

  await app.listen(3000);
}
bootstrap();
