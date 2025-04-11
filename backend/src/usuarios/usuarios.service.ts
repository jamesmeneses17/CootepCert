import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async login(cedula_o_correo: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: [{ correo: cedula_o_correo }, { cedula: cedula_o_correo }],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 5 * 60000);

    // Encriptar el código antes de guardarlo
    const salt = await bcrypt.genSalt();
    const hashedCode = await bcrypt.hash(codigo, salt);

    usuario.codigo_verificacion = hashedCode;
    usuario.codigo_expira = expira;
    await this.usuarioRepo.save(usuario);

    // 🧪 Verificar que las variables de entorno se están leyendo bien
    console.log('📡 Configuración SMTP →', {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS ? '********' : '❌ no encontrada',
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CootepCert" <${process.env.MAIL_USER}>`,
      to: usuario.correo,
      subject: 'Tu código de verificación',
      text: `Hola ${usuario.cedula}, tu código de ingreso es: ${codigo}`,
    });

    return {
      message: 'Código enviado al correo',
      correo: usuario.correo,
    };
  }
}
