import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';

// Decorador que marca la clase como un servicio de NestJS
@Injectable()
export class UsuariosService {
  constructor(
    // Inyectamos el repositorio de usuarios para acceder a la base de datos
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  // Metodo para iniciar sesion mediante el codigo de verificacion
  async login(cedula_o_correo: string) {
    // Busca el usuario por correo o cédula
    const usuario = await this.usuarioRepo.findOne({
      where: [{ correo: cedula_o_correo }, { cedula: cedula_o_correo }],
    });

    // condicion , sino se encuentra el usuario lanzamos una excepcion
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado en la base de datos');
    }

    const ahora = new Date();

    // si el codigo aun es valido (no ha expirado)
    if (usuario.codigo_expira && usuario.codigo_expira > ahora) {
      // si el ultimo reenvio fue hace menos de 60 segundos
      if (
        usuario.ultimo_reenvio &&
        ahora.getTime() - usuario.ultimo_reenvio?.getTime() < 60 * 1000
      ) {
        const segundosRestantes = Math.ceil(
          (60 * 1000 - (ahora.getTime() - usuario.ultimo_reenvio?.getTime())) /
            1000,
        );
        return {
          message:
            'Debes esperar ${segundosRestantes} segundos para volver a enviar el código',
        };
      }

      // Reenviar el mismo codigo
      usuario.ultimo_reenvio = ahora;
      await this.usuarioRepo.save(usuario);

      await this.enviarCorreo(
        usuario.correo,
        usuario.cedula,
        usuario.codigo_verificacion,
      );
      return {
        message: 'Código reenviado al correo',
        correo: usuario.correo,
      };
    }

    // Genera un codigo aleatorio de 6 digitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    // Define una fecha de expiracion para el codigo, 5 minutos
    const expira = new Date(Date.now() + 5 * 60000);

    // Encripta el codigo de verificacion usando bcrypt
    //const salt = await bcrypt.genSalt();
    //const hashedCode = await bcrypt.hash(codigo, salt);

    //Guarda el codigo encriptado y su expiracion en la BD
    //usuario.codigo_verificacion = hashedCode;
    usuario.codigo_verificacion = codigo;
    usuario.codigo_expira = expira;
    await this.usuarioRepo.save(usuario);

    await this.enviarCorreo(usuario.correo, usuario.cedula, codigo);

    // Respuesta de exito al cliente

    return {
      message: 'Código enviado al correo',
      correo: usuario.correo,
    };
  }
  private async enviarCorreo(
    correo: string,
    cedula: string,
    codigo_verificacion: string,
  ) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log(
      ` Enviando código ${codigo_verificacion} al correo: ${correo}`,
    );

    await transporter.sendMail({
      from: `"CootepCert" <${process.env.MAIL_USER}>`,
      to: correo,
      subject: 'Tu código de verificación',
      text: `Hola ${cedula}, tu código de ingreso es: ${codigo_verificacion}`,
    });
  }
}
