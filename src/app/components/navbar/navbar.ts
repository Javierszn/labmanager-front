import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth.service'; // <-- Importado

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isDarkMode: boolean = false;
  
  // POR DEFECTO TODOS SON VISITANTES
  rolUsuario: string = 'visitante'; 

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService // <-- Inyectado
  ) {}

  ngOnInit() {
    // Al cargar la app, busca el "gafete" en el navegador
    const rolGuardado = localStorage.getItem('rol');
    if (rolGuardado) {
      this.rolUsuario = rolGuardado;
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const hostElement = document.documentElement; 

    if (this.isDarkMode) {
      this.renderer.setAttribute(hostElement, 'data-bs-theme', 'dark');
    } else {
      this.renderer.setAttribute(hostElement, 'data-bs-theme', 'light');
    }
  }

  cerrarSesion() {
    // Borramos TODOS los datos guardados en el LocalStorage
    this.authService.logout();
    
    // Lo enviamos de vuelta al login forzando la recarga para limpiar memoria
    window.location.href = '/login'; 
  }
}