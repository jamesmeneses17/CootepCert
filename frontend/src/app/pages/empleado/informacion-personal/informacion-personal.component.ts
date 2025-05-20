import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatoUsuarioComponent } from '../../../shared/components/dato-usuario/dato-usuario.component';
import { MenuUsuarioComponent } from '../../../shared/components/menu-usuario/menu-usuario.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-informacion-personal',
  standalone: true,
  imports: [
    CommonModule,
    DatoUsuarioComponent,
    MenuUsuarioComponent,
    FooterComponent,
    SidebarComponent,
  ],
  templateUrl: './informacion-personal.component.html',
})
export class InformacionPersonalComponent implements OnInit {
  usuario: any = null;
  sidebarAbierto: boolean = true; // inicialmente visible
  public mostrarMenu: boolean = false;

  constructor(private router: Router) {}

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
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al generar el certificado');
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'certificado_laboral.pdf';
        link.click();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  // Método para cerrar sesión
  cerrarSesion(): void {
    localStorage.removeItem('usuario'); // opcional: borra sesión local
    this.router.navigate(['/']); // redirige al inicio (localhost:4200)
  }

  menuItems = [
    { texto: 'Inicio', icono: 'fa-house', accion: () => this.irA('/inicio') },
    {
      texto: 'Información Personal',
      icono: 'fa-user',
      accion: () => this.irA('/empleado/informacion-personal'),
    },
    {
      texto: 'Certificados',
      icono: 'fa-file',
      accion: () => this.irA('/empleado/certificados'),
    },
  ];

  irA(ruta: string) {
    // Router puede inyectarse si no lo has hecho
    this.router.navigate([ruta]);
  }
}
