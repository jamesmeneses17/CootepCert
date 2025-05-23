import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { Empleado } from 'src/empleados/empleado.entity';

// Decorador que marca la clase como un servicio de NestJS
@Injectable()
export class UsuariosService {
 
   constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Empleado)
    private readonly empleadoRepo: Repository<Empleado>,
  ) {}

  // Metodo para iniciar sesion mediante el codigo de verificacion
  async login(cedula_o_correo: string) {
  // Buscar primero por correo directamente en Usuario
  let usuario = await this.usuarioRepo.findOne({
    where: { correo: cedula_o_correo },
    relations: ['empleado'],
  });

  // Si no lo encuentra por correo, buscar por cédula del empleado
  if (!usuario) {
  const empleado = await this.empleadoRepo.findOne({
    where: { cedula: cedula_o_correo },
    relations: ['usuario'],
  });

  if (!empleado || !empleado.usuario) {
    throw new NotFoundException('Empleado o usuario no encontrado');
  }

  usuario = await this.usuarioRepo.findOneOrFail({
    where: { id: empleado.usuario.id },
    relations: ['empleado'],
  });
}


  const ahora = new Date();

  if (usuario.codigo_expira && usuario.codigo_expira > ahora) {
    if (
      usuario.ultimo_reenvio &&
      ahora.getTime() - usuario.ultimo_reenvio.getTime() < 60 * 1000
    ) {
      const segundosRestantes = Math.ceil(
        (60 * 1000 - (ahora.getTime() - usuario.ultimo_reenvio.getTime())) / 1000,
      );
      return {
        message: `Debes esperar ${segundosRestantes} segundos para volver a enviar el código`,
      };
    }

    usuario.ultimo_reenvio = ahora;
    await this.usuarioRepo.save(usuario);

    await this.enviarCorreo(
      usuario.correo,
      `${usuario.empleado?.nombres} ${usuario.empleado?.apellidos}`,
      usuario.codigo_verificacion,
    );

    return {
      message: 'Código reenviado al correo',
      correo: usuario.correo,
    };
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  const expira = new Date(Date.now() + 5 * 60000);

  usuario.codigo_verificacion = codigo;
  usuario.codigo_expira = expira;
  usuario.ultimo_reenvio = ahora;
  await this.usuarioRepo.save(usuario);

  await this.enviarCorreo(
    usuario.correo,
    `${usuario.empleado?.nombres} ${usuario.empleado?.apellidos}`,
    codigo,
  );

  return {
    message: 'Código enviado al correo',
    correo: usuario.correo,
  };
}

  private async enviarCorreo(
    correo: string,
    nombreCompleto: string,
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

    const mensaje = `
Hola ${nombreCompleto},

Tu código de verificación para ingresar a la plataforma es: ${codigo_verificacion}.

Este código es válido por 5 minutos.

Gracias por utilizar CootepCert.
`;

    await transporter.sendMail({
      from: `"CootepCert" <${process.env.MAIL_USER}>`,
      to: correo,
      subject: 'Tu código de verificación',
      text: mensaje,
    });
  }

  // Metodo para verificar el codigo de verificacion
 async verificarCodigo(correo_o_cedula: string, codigo: string) {
  console.log('Verificando código para:', correo_o_cedula, codigo);

  // Buscar por correo directamente en Usuario
  let usuario = await this.usuarioRepo.findOne({
    where: { correo: correo_o_cedula },
    relations: [
      'rol',
      'empleado',
      'empleado.genero',
      'empleado.municipioNacimiento',
      'empleado.lugarExpedicion',
      'empleado.cargo',
      'empleado.tipoContrato',
    ],
  });

  // Si no lo encontró por correo, buscar por cédula del empleado
  if (!usuario) {
    const empleado = await this.empleadoRepo.findOne({
      where: { cedula: correo_o_cedula },
      relations: ['usuario'],
    });

    if (!empleado || !empleado.usuario) {
      throw new NotFoundException('Empleado o usuario no encontrado');
    }

    usuario = await this.usuarioRepo.findOneOrFail({
      where: { id: empleado.usuario.id },
      relations: [
        'rol',
        'empleado',
        'empleado.genero',
        'empleado.municipioNacimiento',
        'empleado.lugarExpedicion',
        'empleado.cargo',
        'empleado.tipoContrato',
      ],
    });
  }

  const ahora = new Date();

  if (!usuario.codigo_expira || usuario.codigo_expira < ahora) {
    return { message: 'El código ha expirado, solicita uno nuevo.' };
  }

  if (usuario.codigo_verificacion !== codigo) {
    return { message: 'Código incorrecto' };
  }

  return {
    message: 'Código verificado correctamente',
    rol: usuario.rol?.nombre,
    usuario: {
      correo: usuario.correo,
      empleadoId: usuario.empleado?.id,
      nombres: usuario.empleado?.nombres,
      apellidos: usuario.empleado?.apellidos,
      fecha_nacimiento: usuario.empleado?.fecha_nacimiento,
      genero: usuario.empleado?.genero,
      municipioNacimiento: usuario.empleado?.municipioNacimiento,
      lugarExpedicion: usuario.empleado?.lugarExpedicion,
      tipoContrato: usuario.empleado?.tipoContrato,
    },
  };
}

}
