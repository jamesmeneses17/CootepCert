import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      identificador: ['', Validators.required],
    });
  }

  enviarCodigo() {
    const { identificador } = this.loginForm.value;
  
    this.http.post('http://localhost:3000/usuarios/login', {
      correo_o_cedula: identificador,
    }).subscribe({
      next: (res) => {
        this.mensaje = 'Código enviado correctamente al correo.';
        this.loginForm.reset(); 
      },
      error: (err) => {
        this.mensaje = 'Error al enviar el código.';
        console.error(err);
        this.loginForm.reset(); 
      }
    });
  }
  
  
}
