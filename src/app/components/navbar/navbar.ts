import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isDarkMode: boolean = false;
  
  
  rolUsuario: string = 'visitante'; 

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService 
  ) {}

  ngOnInit() {
    
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
    
    this.authService.logout();
    
    
    window.location.href = '/login'; 
  }
}