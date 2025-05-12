import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

// Controlador para manejar las rutas relacionadas con los usuarios
@Controller('usuarios')
export class UsuariosController {
  // inyectamos el servicio de UsuariosService para usar  su logica
  constructor(private readonly usuariosService: UsuariosService) {}

  // Ruta POST que responde a /usuarios/login
  @Post('login')
  login(@Body('correo_o_cedula') valor: string) {
    //LLama al meotodo login del servicio , pasando el valor del body
    return this.usuariosService.login(valor);
  }

  // Endpoint para validar el rol

  @Post('verificar')
async verificarCodigo(@Body() body: { correo_o_cedula: string; codigo: string }) {
  return this.usuariosService.verificarCodigo(body.correo_o_cedula, body.codigo);
}

}
