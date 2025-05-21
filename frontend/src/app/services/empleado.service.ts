import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Obtener todos los empleados
  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/empleados`);
  }

  // Obtener un empleado por ID
  getEmpleadoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/empleados/${id}`);
  }

  // Actualizar empleado
  actualizarEmpleado(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/empleados/${id}`, data);
  }

  // Obtener listas auxiliares
  getGeneros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/generos`);
  }

  getMunicipios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/municipios`);
  }

  getCargos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cargos`);
  }

  getTiposContrato(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tipos-contrato`);
  }
}
