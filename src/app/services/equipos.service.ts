import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private baseUrl = 'http://localhost:3000/api/equipos';

  constructor(private http: HttpClient) {}

  // 1. Traer catálogo (AHORA LLEVA TOKEN POR SEGURIDAD)
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
}