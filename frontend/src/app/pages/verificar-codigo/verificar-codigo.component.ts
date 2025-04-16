import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 👈 FormsModule aquí
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificar-codigo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // 👈 necesario para usar [(ngModel)]
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './verificar-codigo.component.html',
})
export class VerificarCodigoComponent {
  codigo: string = '';
  mensaje: string = '';
  correoOCedula: string = '';

  constructor(private http: HttpClient, private router: Router) {
    const temp = localStorage.getItem('usuario_temp');
    if (temp) {
      this.correoOCedula = temp;
    }
  }

  verificarCodigo() {
    this.http.post('http://localhost:3000/usuarios/verificar-codigo', {
      correo_o_cedula: this.correoOCedula,
      codigo: this.codigo,
    }).subscribe({
      next: (res: any) => {
        this.mensaje = '✅ Código verificado con éxito';
        // this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.mensaje = '❌ Código incorrecto o expirado';
        console.error(err);
      }
    });
  }

  reenviarCodigo() {
    this.http.post('http://localhost:3000/usuarios/login', {
      correo_o_cedula: this.correoOCedula,
    }).subscribe({
      next: () => {
        this.mensaje = '📨 Código reenviado al correo';
      },
      error: (err) => {
        this.mensaje = '❌ Error al reenviar el código';
        console.error(err);
      }
    });
  }
}
