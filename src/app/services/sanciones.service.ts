import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SancionesService {
  private baseUrl = 'http://localhost:3000/api/sanciones';

  constructor(private http: HttpClient) {}

  obtenerMisSanciones(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.get<any>(`${this.baseUrl}/mis-sanciones`, { headers });
  }

  obtenerSanciones(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.get<any>(this.baseUrl, { headers });
  }

  crearSancion(datos: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.post<any>(this.baseUrl, datos, { headers });
  }

  resolverSancion(id: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.put<any>(`${this.baseUrl}/${id}/resolver`, {}, { headers });
  }

  eliminarSancion(id: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers });
  }
}