import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado } from 'src/app/models/empleado.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-listado-empleados',
  templateUrl: './listado-empleados.component.html',
  standalone: true,
  imports: [CommonModule], // Asegúrate de que esto esté presente
})
export class ListadoEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        console.log('Empleados cargados:', this.empleados);
      },
      error: (err) => {
        console.error('Error al cargar empleados', err);
      }
    });
  }
}
