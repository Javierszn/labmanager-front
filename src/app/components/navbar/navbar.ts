import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; 

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
    private renderer: Renderer2
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
    // Le quitamos el gafete de admin/alumno
    localStorage.removeItem('rol');
    
    // Lo enviamos de vuelta al login forzando la recarga
    window.location.href = '/login'; 
  }
}