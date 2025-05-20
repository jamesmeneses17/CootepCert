import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VerificarCodigoComponent } from './pages/verificar-codigo/verificar-codigo.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { AdminComponent } from './pages/admin/admin.component';
import { InformacionPersonalComponent } from './pages/empleado/informacion-personal/informacion-personal.component';
import { ListadoEmpleadosComponent } from './pages/admin/listado-empleados/listado-empleados.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'verificar', component: VerificarCodigoComponent },

  {
    path: 'empleado',
    component: EmpleadoComponent,
    children: [
      { path: '', redirectTo: 'informacion-personal', pathMatch: 'full' },
      { path: 'informacion-personal', component: InformacionPersonalComponent },
    ],
  },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'empleados', pathMatch: 'full' },
      { path: 'empleados', component: ListadoEmpleadosComponent },
    ],
  },
];
