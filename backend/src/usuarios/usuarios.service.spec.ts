import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest
      .fn()
      .mockResolvedValue({ accepted: ['empleado@cootep.com'] }),
  }),
}));

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repo: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    repo = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));

    // Agregamos los métodos para evitar errores
    (repo as any).findOne = jest.fn();
    (repo as any).save = jest.fn();
  });

  it('debe generar y enviar un código a un correo válido', async () => {
    const mockUser: Usuario = {
      id: 1,
      correo: 'empleado@cootep.com',
      cedula: '123456789',
      codigo_verificacion: null,
      codigo_expira: null,
      ultimo_reenvio: null,
      empleado: {
        nombres: 'Juan',
        apellidos: 'Pérez',
      } as any,
      rol: null,
    } as any;

    jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(repo, 'save').mockResolvedValue(mockUser);

    const response = await service.login(mockUser.correo);

    expect(response).toHaveProperty('message', 'Código enviado al correo');

    const sendMailMock = nodemailer.createTransport().sendMail as jest.Mock;
    expect(sendMailMock).toHaveBeenCalled();
  });

  it('debe retornar "Código incorrecto" si el código no coincide', async () => {
    const mockUser: Usuario = {
      id: 1,
      correo: 'empleado@cootep.com',
      cedula: '123456789',
      codigo_verificacion: '123456', // Código guardado
      codigo_expira: new Date(Date.now() + 5 * 60000), // Aún válido
      empleado: {
        nombres: 'Ana',
        apellidos: 'García',
      } as any,
      rol: {
        nombre: 'empleado',
      } as any,
      ultimo_reenvio: null,
    } as any;

    jest.spyOn(repo, 'findOneOrFail').mockResolvedValue(mockUser);

    const response = await service.verificarCodigo(mockUser.correo, '999999'); // Código incorrecto

    expect(response).toEqual({ message: 'Código incorrecto' });
  });

  it('debe retornar "El código ha expirado" si la fecha ya pasó', async () => {
    const mockUser: Usuario = {
      id: 2,
      correo: 'otro@cootep.com',
      cedula: '987654321',
      codigo_verificacion: '654321',
      codigo_expira: new Date(Date.now() - 60 * 1000), // Expirado hace 1 minuto
      empleado: {
        nombres: 'Luis',
        apellidos: 'Mendoza',
      } as any,
      rol: {
        nombre: 'empleado',
      } as any,
      ultimo_reenvio: null,
    } as any;

    jest.spyOn(repo, 'findOneOrFail').mockResolvedValue(mockUser);

    const response = await service.verificarCodigo(mockUser.correo, '654321');

    expect(response).toEqual({
      message: 'El código ha expirado, solicita uno nuevo.',
    });
  });

  it('debe impedir reenvío si no han pasado 60 segundos desde el último', async () => {
    const ahora = new Date();
    const hace30seg = new Date(ahora.getTime() - 30 * 1000); // Hace 30 segundos

    const mockUser: Usuario = {
      id: 3,
      correo: 'tiempo@cootep.com',
      cedula: '55555555',
      codigo_verificacion: '112233',
      codigo_expira: new Date(ahora.getTime() + 4 * 60000), // aún válido (4 min restantes)
      ultimo_reenvio: hace30seg, // hace 30 segundos
      empleado: {
        nombres: 'Tiempo',
        apellidos: 'Corto',
      } as any,
      rol: {
        nombre: 'empleado',
      } as any,
    } as any;

    jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(repo, 'save').mockResolvedValue(mockUser);

    const response = await service.login(mockUser.correo);

    expect(response.message).toContain('Debes esperar');
  });

  it('debe verificar correctamente el código válido e iniciar sesión', async () => {
    const mockUser: Usuario = {
      id: 4,
      correo: 'exitoso@cootep.com',
      cedula: '11112222',
      codigo_verificacion: '888888',
      codigo_expira: new Date(Date.now() + 5 * 60 * 1000), // 5 min más
      empleado: {
        nombres: 'Éxito',
        apellidos: 'Total',
      } as any,
      rol: {
        nombre: 'empleado',
      } as any,
      ultimo_reenvio: null,
    } as any;

    jest.spyOn(repo, 'findOneOrFail').mockResolvedValue(mockUser);

    const response = await service.verificarCodigo(mockUser.correo, '888888');

    expect(response).toEqual({
      message: 'Código verificado correctamente',
      rol: 'empleado',
      usuario: {
        nombres: 'Éxito',
        apellidos: 'Total',
        correo: 'exitoso@cootep.com',
      },
    });
  });

  it('debe lanzar excepción si el usuario no está registrado', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => {
      throw new Error('Usuario no encontrado');
    });

    await expect(
      service.verificarCodigo('inexistente@cootep.com', '123456'),
    ).rejects.toThrow('Usuario no encontrado');
  });
});
