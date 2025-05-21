import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VerificarCodigoComponent } from './pages/verificar-codigo/verificar-codigo.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { AdminComponent } from './pages/admin/admin.component';
import { InformacionPersonalComponent } from './pages/empleado/informacion-personal/informacion-personal.component';
import { ListadoEmpleadosComponent } from './pages/admin/listado-empleados/listado-empleados.component';
import { EditarEmpleadoComponent } from './pages/admin/editar-empleado/editar-empleado.component';
import { SolicitarCertificadoComponent } from './pages/empleado/solicitar-certificado/solicitar-certificado.component';
import { HistorialCertificadosComponent } from './pages/empleado/historial-certificados/historial-certificados.component';
import { AyudaComponent } from './pages/empleado/ayuda/ayuda.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'verificar', component: VerificarCodigoComponent },

  {
    path: 'empleado',
    component: EmpleadoComponent,
    children: [
      { path: '', redirectTo: 'informacion-personal', pathMatch: 'full' },
      { path: 'informacion-personal', component: InformacionPersonalComponent },
      { path: 'solicitar-certificado', component: SolicitarCertificadoComponent },
      { path: 'historial-certificados', component: HistorialCertificadosComponent },
      { path: 'ayuda', component: AyudaComponent },
    ],
  },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'empleados', pathMatch: 'full' },
      { path: 'empleados', component: ListadoEmpleadosComponent },
      { path: 'empleados/editar/:id', component: EditarEmpleadoComponent },
    ],
  },
];
