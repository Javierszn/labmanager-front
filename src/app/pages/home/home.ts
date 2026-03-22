import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // Asegúrate de tener RouterLink
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
  constructor(
    private router: Router,
    private renderer: Renderer2 // Renderer2 es mejor práctica para tocar el DOM en Angular
  ) {
    // Podrías inicializar el Modo Oscuro aquí basado en localStorage si quieres
  }

  // Función temporal para ir al catálogo (se conectará después)
  abrirDetalles(id: number) {
    // Por ahora solo vamos al catálogo, después haremos que se abra 
    // directamente el detalle del equipo con ese ID
    this.router.navigate(['/catalogo']);
  }
}