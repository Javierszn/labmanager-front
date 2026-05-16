import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private baseUrl = 'http://localhost:3000/api/equipos';

  constructor(private http: HttpClient) {}

  // Obtener todos los equipos de la base de datos
  obtenerEquipos() {
    // Obtenemos el token del localStorage por si tu ruta de equipos está protegida
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);

    return this.http.get<any>(this.baseUrl, { headers });
  }
}