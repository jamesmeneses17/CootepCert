import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // Configura Swagger para documentar la API
  const config = new DocumentBuilder()
    .setTitle('CootepCert API')
    .setDescription('Documentación de la API para autenticación y certificados laborales')
    .setVersion('1.0')
    .addTag('auth') // puedes usar varios tags como empleados, certificados, etc.
    .build(); //h

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Esto crea la ruta http://localhost:3000/api

  // Inicia el servidor en el puerto 3000
  await app.listen(3000);
}
bootstrap();
