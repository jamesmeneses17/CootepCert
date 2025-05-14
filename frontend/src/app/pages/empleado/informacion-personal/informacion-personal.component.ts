import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // 👈 agrega ReactiveFormsModule
import { EmpleadoService } from '../../../services/empleado.service';

@Component({
  selector: 'app-informacion-personal',
  standalone: true,
  imports: [ReactiveFormsModule], // 👈 agrégalo aquí
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.css']
})
export class InformacionPersonalComponent implements OnInit {
  form: FormGroup;
  empleadoId = 1;

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService
  ) {
    this.form = this.fb.group({
      nombres: [''],
      apellidos: [''],
      // otros campos...
    });
  }

  ngOnInit(): void {
    // Aquí puedes hacer this.empleadoService.getEmpleado(this.empleadoId) si deseas
  }

  guardar() {
    console.log(this.form.value);
  }
}
