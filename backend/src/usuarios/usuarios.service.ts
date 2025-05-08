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

    // Genera un codigo aleatorio de 6 digitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    // Define una fecha de expiracion para el codigo, 5 minutos
    const expira = new Date(Date.now() + 5 * 60000);

    // Encripta el codigo de verificacion usando bcrypt
    const salt = await bcrypt.genSalt();
    const hashedCode = await bcrypt.hash(codigo, salt);

    //Guarda el codigo encriptado y su expiracion en la BD
    usuario.codigo_verificacion = hashedCode;
    usuario.codigo_expira = expira;
    await this.usuarioRepo.save(usuario);

    //Muestra en consola la configuracion SMTP
    console.log('📡 Configuración SMTP →', {
      host: process.env.MAIL_HOST, // Direccion del servidor del proveedor de correo "smtp.gmail.com"
      port: process.env.MAIL_PORT, // Puerto del servidor SMTP "587"
      user: process.env.MAIL_USER, // Usuario del correo que envia el mensaje
      pass: process.env.MAIL_PASS ? '********' : '❌ no encontrada',
    });

    // Configura el servicio de envio de correos usando nodemailer
    const transporter = nodemailer.createTransport({
      // Crea un transporte a traves de servidor SMTP
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Envia el correo con el codigo de verificacion al usuario

    await transporter.sendMail({
      from: `"CootepCert" <${process.env.MAIL_USER}>`,
      to: usuario.correo,
      subject: 'Tu código de verificación',
      text: `Hola ${usuario.cedula}, tu código de ingreso es: ${codigo}`,
    });

    // Respuesta de exito al cliente

    return {
      message: 'Código enviado al correo',
      correo: usuario.correo,
    };
  }
}
