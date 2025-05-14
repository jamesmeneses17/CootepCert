import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empleado {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  fecha_ingreso: string;
  lugarExpedicion: { id: number };
  municipioNacimiento: { id: number };
  genero: { id: number };
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/empleados';

  constructor(private http: HttpClient) {}

  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  updateEmpleado(id: number, data: Partial<Empleado>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
