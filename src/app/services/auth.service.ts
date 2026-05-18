import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // REGRESAMOS A LOCALHOST
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(correo: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { correo, password })
      .pipe(
        tap(respuesta => {
          if (respuesta.ok) {
            localStorage.setItem('token', respuesta.token);
            localStorage.setItem('rol', respuesta.usuario.rol);
            localStorage.setItem('estado', respuesta.usuario.estado); 
          }
        })
      );
  }

  registro(nombre: string, correo: string, password: string, telefono: string = '', institucion: string = '', facultad: string = '') {
    return this.http.post<any>(`${this.baseUrl}/registro`, { nombre, correo, password, telefono, institucion, facultad });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('estado'); 
  }
  
  obtenerMiPerfil(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.get<any>(`${this.baseUrl}/me`, { headers });
  }

  actualizarMiPerfil(datos: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.put<any>(`${this.baseUrl}/me`, datos, { headers });
  }

  actualizarPassword(password: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.put<any>(`${this.baseUrl}/me/password`, { password }, { headers });
  }

  eliminarMiCuenta(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.delete<any>(`${this.baseUrl}/me`, { headers });
  }

  solicitarRecuperacion(correo: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/recuperar`, { correo });
  }

  resetearPasswordOlvidada(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password/${token}`, { password });
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