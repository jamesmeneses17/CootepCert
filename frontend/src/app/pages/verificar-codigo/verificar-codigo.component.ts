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
    HttpClientModule,
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
    this.http
      .post('http://localhost:3000/usuarios/verificar', {
        correo_o_cedula: this.correoOCedula,
        codigo: this.codigo,
      })
      .subscribe({
        next: (res: any) => {
          this.mensaje = '✅ Código verificado con éxito';
          // this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.mensaje = '❌ Código incorrecto o expirado';
          console.error(err);
        },
      });
  }

  contador: number = 0;
  temporizador: any;

  reenviarCodigo() {
    if (this.contador > 0) return; // Evita reenviar si el contador no ha terminado

    const identificador = localStorage.getItem('usuario_temp');
    if (!identificador) return;

    this.http
      .post('http://localhost:3000/usuarios/login', {
        correo_o_cedula: identificador,
      })
      .subscribe({
        next: (res: any) => {
          this.mensaje = res.message;

          if (
            res.message.includes('reenviado') ||
            res.message.includes('enviado')
          ) {
            this.iniciarContador(); // 🔄 Inicia el temporizador
          }
        },
        error: (err) => {
          this.mensaje = 'Error al reenviar código.';
        },
      });
  }

  iniciarContador() {
    this.contador = 60;
    this.temporizador = setInterval(() => {
      this.contador--;
      if (this.contador <= 0) {
        clearInterval(this.temporizador);
      }
    }, 1000);
  }
}
