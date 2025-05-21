import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-editar-empleado',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './editar-empleado.component.html',
  styleUrls: ['./editar-empleado.component.css'] // ✅ corregido "styleUrls" en plural
})
export class EditarEmpleadoComponent implements OnInit {
  empleado: any = null;
  id: number = 0;

  generos: any[] = [];
  municipios: any[] = [];
  cargos: any[] = [];
  tiposContrato: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private empleadoService: EmpleadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.empleadoService.getEmpleadoById(this.id).subscribe(data => {
      this.empleado = data;
    });

    // ✅ Cargar los datos para los <select>
    this.empleadoService.getGeneros().subscribe(data => this.generos = data);
    this.empleadoService.getMunicipios().subscribe(data => this.municipios = data);
    this.empleadoService.getCargos().subscribe(data => this.cargos = data);
    this.empleadoService.getTiposContrato().subscribe(data => this.tiposContrato = data);
  }

  guardar(): void {
    this.empleadoService.actualizarEmpleado(this.id, this.empleado).subscribe(() => {
      alert('Empleado actualizado correctamente');
      this.router.navigate(['/admin/empleados']);
    });
  }
}
