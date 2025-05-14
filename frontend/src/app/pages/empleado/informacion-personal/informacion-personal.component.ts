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
}
