import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios') // 👈 Esto es clave
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login') // 👈 Esto hace que se forme /usuarios/login
  login(@Body('correo_o_cedula') valor: string) {
    return this.usuariosService.login(valor);
  }
}
