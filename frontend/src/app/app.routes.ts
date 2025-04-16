import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VerificarCodigoComponent } from './pages/verificar-codigo/verificar-codigo.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'verificar', component: VerificarCodigoComponent },
];
