import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private baseUrl = 'http://localhost:3000/api/equipos';

  constructor(private http: HttpClient) {}

 
  obtenerEquipos(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.get<any>(this.baseUrl, { headers });
  }

  // 2. Crear un equipo nuevo en Mongo (Requiere ser Admin)
  crearEquipo(datos: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.post<any>(this.baseUrl, datos, { headers });
  }

  // 3. Editar un equipo existente (Requiere ser Admin)
  actualizarEquipo(id: string, datos: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.put<any>(`${this.baseUrl}/${id}`, datos, { headers });
  }

  // 4. Eliminar/Dar de baja un equipo de la base de datos (Requiere ser Admin)
  eliminarEquipo(id: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers });
  }
}