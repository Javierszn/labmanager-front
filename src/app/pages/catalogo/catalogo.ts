import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EquiposService } from '../../services/equipos.service';
import { PrestamosService } from '../../services/prestamos.service'; 

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  terminoBusqueda: string = '';
  mostrarToast: boolean = false;
  mensajeToast: string = '';

  equipoSeleccionado: any = null;
  equipoParaAgregar: any = null;
  fechaSalidaTemp: string = '';
  fechaEntregaTemp: string = '';
  cantidadTemp: number = 1; // <-- Nueva variable para la cantidad

  equipos: any[] = [];
  carrito: any[] = [];

  constructor(
    private equiposService: EquiposService,
    private prestamosService: PrestamosService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.cargarEquiposReales();
  }

  cargarEquiposReales() {
    this.equiposService.obtenerEquipos().subscribe({
      next: (respuesta) => {
        this.equipos = respuesta.equipos.map((eq: any) => ({
          ...eq,
          id: eq._id, 
          stock: eq.stockDisponible, 
          img: eq.img || eq.imagenUrl || 'https://placehold.co/600x400/eeeeee/000000?text=Sin+Imagen'
        }));
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
        this.mostrarNotificacion('⚠️ Error al conectar con la base de datos');
        this.cdr.detectChanges();
      }
    });
  }

  get equiposFiltrados() {
    return this.equipos.filter(equipo => 
      equipo.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
      (equipo.categoria?.nombre || '').toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  abrirDetalles(equipo: any) {
    this.equipoSeleccionado = equipo;
    this.cdr.detectChanges();
  }

  mostrarNotificacion(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    this.cdr.detectChanges();

    setTimeout(() => { 
      this.mostrarToast = false; 
      this.cdr.detectChanges();
    }, 3000);
  }

  prepararAgregar(equipo: any) {
    if (!localStorage.getItem('token')) {
      this.mostrarNotificacion('🔒 Necesitas iniciar sesión para pedir material');
      return;
    }
    
    this.equipoParaAgregar = equipo;
    this.fechaSalidaTemp = '';
    this.fechaEntregaTemp = '';
    this.cantidadTemp = 1; // <-- Reiniciamos a 1 cada que abre un equipo
    this.cdr.detectChanges();
  }

  confirmarAgregarAlCarrito() {
    const yaExiste = this.carrito.find(item => item.id === this.equipoParaAgregar.id);
    
    // <-- Validación de cantidad agregada
    if (this.cantidadTemp < 1 || this.cantidadTemp > this.equipoParaAgregar.stock) {
      this.mostrarNotificacion(`⚠️ Cantidad inválida. Máximo disponible: ${this.equipoParaAgregar.stock}`);
      return;
    }

    if (!yaExiste) {
      this.carrito.push({
        ...this.equipoParaAgregar,
        fechaSalida: this.fechaSalidaTemp,
        fechaEntrega: this.fechaEntregaTemp,
        cantidadSolicitada: this.cantidadTemp // <-- Pasamos la cantidad ingresada
      });
      this.mostrarNotificacion(`✅ ${this.cantidadTemp}x ${this.equipoParaAgregar.nombre} agregado(s).`);
    } else {
      this.mostrarNotificacion(`⚠️ El equipo ya está en tu carrito.`);
    }
  }

  quitarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.cdr.detectChanges();
  }

  confirmarPrestamo() {
    if (this.carrito.length === 0) return;

    const equiposMapeados = this.carrito.map(item => ({
      equipo: item.id, 
      cantidad: item.cantidadSolicitada || 1 // <-- Mandamos a la BD la cantidad real
    }));

    const payload = {
      equipos: equiposMapeados,
      fechaSalida: this.carrito[0].fechaSalida,
      fechaLimite: this.carrito[0].fechaEntrega
    };

    this.prestamosService.crearPrestamo(payload).subscribe({
      next: (respuesta) => {
        this.mostrarNotificacion(`🎉 ¡Préstamo registrado exitosamente!`);
        this.carrito = []; 
        this.cargarEquiposReales(); 
      },
      error: (err) => {
        console.error('Error al pedir préstamo:', err);
        const mensajeReal = err.error?.msg || 'Error al procesar la solicitud';
        this.mostrarNotificacion(`❌ ${mensajeReal}`);
        this.cdr.detectChanges();
      }
    });
  }
}