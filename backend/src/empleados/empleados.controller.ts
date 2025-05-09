import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { Empleado } from './empleado.entity';

// Controlador que gestiona las rutas relacionados con los empleados
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  create(@Body() body: Partial<Empleado>) {
    return this.empleadosService.create(body);
  }

  @Get()
  findAll() {
    return this.empleadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadosService.findOne(+id);
  }

  // Endpoint para actualizar un empleado por ID

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Empleado>) {
    return this.empleadosService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadosService.remove(+id);
  }
}
