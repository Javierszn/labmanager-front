import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamosService } from '../../services/prestamos.service';

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-history.html',
  styleUrl: './user-history.css'
})
export class UserHistory implements OnInit {
  
  historialPrestamos: any[] = [];
  cargando: boolean = true;

  // Variables para diseño moderno
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  tipoToast: string = 'success';
  prestamoSeleccionadoId: string = ''; 

  constructor(
    private prestamosService: PrestamosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarMiHistorial();
  }

  cargarMiHistorial() {
    this.prestamosService.obtenerMisPrestamos().subscribe({
      next: (respuesta) => {
        this.historialPrestamos = respuesta.prestamos;
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  mostrarNotificacion(mensaje: string, tipo: string = 'success') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
    this.cdr.detectChanges();
    setTimeout(() => { 
      this.mostrarToast = false; 
      this.cdr.detectChanges();
    }, 3500);
  }

  
  prepararCancelacion(id: string) {
    this.prestamoSeleccionadoId = id;
  }

  // Se llama desde adentro del Modal al confirmar
  confirmarCancelacion() {
    if (!this.prestamoSeleccionadoId) return;

    this.prestamosService.cancelarPrestamo(this.prestamoSeleccionadoId).subscribe({
      next: (res) => {
        this.mostrarNotificacion('✅ Solicitud cancelada. El material volvió al inventario.', 'success');
        this.cargarMiHistorial(); 
      },
      error: (err) => {
        console.error(err);
        this.mostrarNotificacion('❌ Hubo un problema al cancelar la solicitud.', 'danger');
      }
    });
  }

  obtenerColorEstado(estado: string): string {
    switch(estado) {
      case 'Pendiente': return 'bg-warning text-dark';
      case 'Activo': return 'bg-primary';
      case 'Devuelto': return 'bg-success';
      case 'Rechazado': return 'bg-danger';
      case 'Cancelado': return 'bg-secondary';
      case 'Atrasado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}