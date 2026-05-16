import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  private baseUrl = 'http://localhost:3000/api/prestamos';

  constructor(private http: HttpClient) {}

  crearPrestamo(datosPrestamo: any) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.post<any>(this.baseUrl, datosPrestamo, { headers });
  }

  obtenerMisPrestamos() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.get<any>(`${this.baseUrl}/mis-prestamos`, { headers }); 
  }

  // NUEVA FUNCIÓN PARA CANCELAR
  cancelarPrestamo(idPrestamo: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    // Haremos una petición PUT al backend para cambiar el estado
    return this.http.put<any>(`${this.baseUrl}/cancelar/${idPrestamo}`, {}, { headers });
  }
}