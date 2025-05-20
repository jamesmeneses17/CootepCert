import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-menu-usuario',
  imports: [CommonModule],
  templateUrl: './menu-usuario.component.html',
  styleUrl: './menu-usuario.component.css'
})
export class MenuUsuarioComponent {
  @Input() nombres: string = '';
  @Input() apellidos: string = '';
  @Output() cerrarSesion = new EventEmitter<void>();

  mostrarMenu = false;

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  cerrar() {
    this.cerrarSesion.emit();
    this.mostrarMenu = false;
  }
}
