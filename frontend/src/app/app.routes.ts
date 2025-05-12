import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VerificarCodigoComponent } from './pages/verificar-codigo/verificar-codigo.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'verificar', component: VerificarCodigoComponent },
  { path: 'empleado', component: EmpleadoComponent },
  { path: 'admin', component: AdminComponent },
];
