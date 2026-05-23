import { Component, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EquiposService } from '../../services/equipos.service'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  
  isLoggedIn: boolean = false;
  userRol: string = '';

 
  equiposDestacados: any[] = []; 
  cargandoEquipos: boolean = true;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService,
    private equiposService: EquiposService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Verificamos la sesión
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (token && rol) {
      this.isLoggedIn = true;
      this.userRol = rol;
    }

    // 2. Cargamos los equipos de verdad
    this.cargarEquiposDestacados();
  }

  cargarEquiposDestacados() {
    this.equiposService.obtenerEquipos().subscribe({
      next: (res: any) => {
        
        this.equiposDestacados = res.equipos.slice(0, 3);
        this.cargandoEquipos = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar equipos en el Home', err);
        this.cargandoEquipos = false;
        this.cdr.detectChanges();
      }
    });
  }

  irAlCatalogo() {
    this.router.navigate(['/catalogo']);
  }

  irAlPanelAdmin() {
    this.router.navigate(['/admin/inventario']);
  }
}