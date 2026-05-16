import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

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
          }
        })
      );
  }

  // Petición POST real para REGISTRAR NUEVA CUENTA (Ya no loguea en automático)
  registro(nombre: string, correo: string, password: string, matricula: string = '') {
    return this.http.post<any>(`${this.baseUrl}/registro`, { nombre, correo, password, matricula });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}