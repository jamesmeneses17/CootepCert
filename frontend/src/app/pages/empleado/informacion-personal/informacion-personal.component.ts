import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informacion-personal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion-personal.component.html',
})
export class InformacionPersonalComponent implements OnInit {
  usuario: any = null;
  sidebarAbierto: boolean = true; // inicialmente visible


  ngOnInit(): void {
    const datos = localStorage.getItem('usuario');

    if (datos) {
      try {
        this.usuario = JSON.parse(datos);
        console.log('Usuario cargado desde localStorage:', this.usuario);
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error);
      }
    } else {
      console.warn('⚠ No hay información del usuario en localStorage.');
    }
  }
  toggleSidebar(): void {
  this.sidebarAbierto = !this.sidebarAbierto;
}

  generarCertificado(): void {
    const empleadoId = this.usuario?.empleadoId;

    if (!empleadoId) {
      console.error('ID de empleado no disponible');
      return;
    }

const url = `http://localhost:3000/certificados/${empleadoId}/generar`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al generar el certificado');
        }
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'certificado_laboral.pdf';
        link.click();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
}
