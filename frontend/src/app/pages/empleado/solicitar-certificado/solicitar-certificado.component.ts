import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]

@Component({
  selector: 'app-solicitar-certificado',
  standalone: true, // 👈 importante si usas Angular standalone components
  imports: [FormsModule], // 👈 se declara aquí para habilitar ngModel
  templateUrl: './solicitar-certificado.component.html',
  styleUrls: ['./solicitar-certificado.component.css'],
})
export class SolicitarCertificadoComponent {
  tipoCertificado: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private http: HttpClient) {}

  generarCertificado() {
    const empleadoId = localStorage.getItem('empleadoId');

    if (!empleadoId || !this.tipoCertificado) {
      console.error('Falta el tipo o el ID del empleado');
      return;
    }

    const payload = {
      tipo: this.tipoCertificado,
      fechaInicio: this.fechaInicio || undefined,
      fechaFin: this.fechaFin || undefined,
    };

    const url = `http://localhost:3000/certificados/${empleadoId}/generar`;

    this.http.post(url, payload, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'certificado_laboral.pdf';
        link.click();
      },
      error: (err) => {
        console.error('Error al generar el certificado', err);
      },
    });
  }
}
