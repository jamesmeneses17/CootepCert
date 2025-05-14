import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/empleados';

  constructor(private http: HttpClient) {}

  // Método unificado para obtener un empleado por ID
 findOne(id: number): Observable<Empleado> {
  return this.http.get<Empleado>(`http://localhost:3000/empleados/${id}`);
}


  // Actualizar un empleado por ID
  update(id: number, data: Partial<Empleado>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
