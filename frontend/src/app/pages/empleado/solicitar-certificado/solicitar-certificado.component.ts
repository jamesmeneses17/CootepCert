import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Importar FormsModule

@Component({
  selector: 'app-solicitar-certificado',
  standalone: true, // ✅ Este componente es standalone
  imports: [FormsModule], // ✅ Aquí habilitas ngModel
  templateUrl: './solicitar-certificado.component.html',
  styleUrl: './solicitar-certificado.component.css',
})
export class SolicitarCertificadoComponent {
  tipoCertificado: string = '';
  fechaInicio?: string;
  fechaFin?: string;

  generarCertificado() {
    console.log('Generar certificado con:', {
      tipo: this.tipoCertificado,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
    });
  }
}
