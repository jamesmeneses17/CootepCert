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
      relations: ['empleado'], // Obtiene nombres y apellidos del empleado
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
        `${usuario.empleado?.nombres} ${usuario.empleado?.apellidos}`,
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

    await this.enviarCorreo(
      usuario.correo,
      `${usuario.empleado?.nombres} ${usuario.empleado?.apellidos}`,
      codigo,
    );

    // Respuesta de exito al cliente

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
    const usuario = await this.usuarioRepo.findOneOrFail({
      where: [
        {
          correo: correo_o_cedula,
        },
        { cedula: correo_o_cedula },
      ],
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

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ahora = new Date();

    // Verificar si el código ha expirado
    if (!usuario.codigo_expira || usuario.codigo_expira < ahora) {
      return { message: 'El código ha expirado, solicita uno nuevo.' };
    }

    // Validar si el código coincide (no encriptado)
    if (usuario.codigo_verificacion !== codigo) {
      return { message: 'Código incorrecto' };
    }

    // Retornar el rol o exito

    return {
      message: 'Código verificado correctamente',
      rol: usuario.rol?.nombre,
      usuario: {
        correo: usuario.correo,
        empleadoId: usuario.empleado?.id,
        nombres: usuario.empleado?.nombres,
        apellidos: usuario.empleado?.apellidos,
        fecha_nacimiento: usuario.empleado?.fecha_nacimiento,
        fecha_ingreso: usuario.empleado?.fecha_ingreso,
        genero: usuario.empleado?.genero,
        municipioNacimiento: usuario.empleado?.municipioNacimiento,
        lugarExpedicion: usuario.empleado?.lugarExpedicion,
        cargo: usuario.empleado?.cargo,
        tipoContrato: usuario.empleado?.tipoContrato,
      },
    };
  }
}
