import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // Petición POST real para INICIAR SESIÓN
  login(correo: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { correo, password })
      .pipe(
        tap(respuesta => {
          if (respuesta.ok) {
            // Guardamos las credenciales reales devueltas por MongoDB
            localStorage.setItem('token', respuesta.token);
            localStorage.setItem('rol', respuesta.usuario.rol);
            // <-- NUEVO: Guardamos el estado del usuario para bloquear vistas -->
            localStorage.setItem('estado', respuesta.usuario.estado); 
          }
        })
      );
  }

  // Petición POST real para REGISTRAR NUEVA CUENTA
  registro(nombre: string, correo: string, password: string, matricula: string = '') {
    return this.http.post<any>(`${this.baseUrl}/registro`, { nombre, correo, password, matricula });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('estado'); // <-- NUEVO: Limpiamos al salir
  }
  
  obtenerAlumnos(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.get<any>(`${this.baseUrl}/alumnos`, { headers });
  }

  actualizarEstadoAlumno(id: string, estado: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.put<any>(`${this.baseUrl}/alumnos/${id}/estado`, { estado }, { headers });
  }
}