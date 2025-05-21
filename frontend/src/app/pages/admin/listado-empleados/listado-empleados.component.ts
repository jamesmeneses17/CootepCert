import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado } from 'src/app/models/empleado.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado-empleados',
  templateUrl: './listado-empleados.component.html',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
})
export class ListadoEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  filtro: string = '';

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

  get empleadosFiltrados() {
    const term = this.filtro.toLowerCase();
    return this.empleados.filter(emp =>
      emp.cedula?.toLowerCase().includes(term) ||
      emp.nombres?.toLowerCase().includes(term)
    );
  }
}
