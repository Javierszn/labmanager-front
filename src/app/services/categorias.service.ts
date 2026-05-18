import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private baseUrl = 'https://labmanager-api.onrender.com/api/categorias';

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  crearCategoria(datos: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.post<any>(this.baseUrl, datos, { headers });
  }

  actualizarCategoria(id: string, datos: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.put<any>(`${this.baseUrl}/${id}`, datos, { headers });
  }

  eliminarCategoria(id: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers });
  }
}