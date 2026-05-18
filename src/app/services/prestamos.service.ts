import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  private baseUrl = 'https://labmanager-api.onrender.com/api/prestamos';

  constructor(private http: HttpClient) {}

  // 1. Alumno: Crear solicitud
  crearPrestamo(datosPrestamo: any) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.post<any>(this.baseUrl, datosPrestamo, { headers });
  }

  // 2. Alumno: Ver su propio historial
  obtenerMisPrestamos() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.get<any>(`${this.baseUrl}/mis-prestamos`, { headers }); 
  }

  // 3. Alumno: Cancelar su propia solicitud
  cancelarPrestamo(idPrestamo: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.put<any>(`${this.baseUrl}/cancelar/${idPrestamo}`, {}, { headers });
  }

  // ==========================================
  // NUEVOS MÉTODOS PARA EL ADMINISTRADOR
  // ==========================================

  // 4. Admin: Traer TODOS los préstamos de la universidad
  obtenerTodosPrestamos() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.get<any>(`${this.baseUrl}/admin`, { headers });
  }

  // 5. Admin: Cambiar estado a 'Activo', 'Devuelto' o 'Rechazado'
  actualizarEstadoPrestamo(idPrestamo: string, nuevoEstado: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.put<any>(`${this.baseUrl}/admin/${idPrestamo}`, { estado: nuevoEstado }, { headers });
  }
}