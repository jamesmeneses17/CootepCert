import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Controlador raiz de la aplicación
// Expone un endpoint GET en la raíz de la aplicación

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
