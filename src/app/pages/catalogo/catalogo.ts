import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { EquiposService } from '../../services/equipos.service';
import { PrestamosService } from '../../services/prestamos.service'; 
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  terminoBusqueda: string = '';
  categoriaFiltro: string = ''; 
  
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  tipoToast: string = 'success'; 

  equipoSeleccionado: any = null;
  equipoParaAgregar: any = null;
  fechaSalidaTemp: string = '';
  fechaEntregaTemp: string = '';
  cantidadTemp: number = 1; 

  equipos: any[] = [];
  categorias: any[] = []; 
  carrito: any[] = [];

  constructor(
    private equiposService: EquiposService,
    private prestamosService: PrestamosService,
    private categoriasService: CategoriasService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.cargarEquiposReales();
    this.cargarCategorias(); 
  }

  // GETTER DINÁMICO: Siempre sabe exactamente si hay token en tiempo real
  get tieneSesion(): boolean {
    return !!localStorage.getItem('token');
  }

  cargarCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (res: any) => {
        this.categorias = res.categorias;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar categorías', err)
    });
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
        this.mostrarNotificacion('⚠️ Error al conectar con la base de datos', 'danger');
      }
    });
  }

  get equiposFiltrados() {
    return this.equipos.filter(equipo => {
      const coincideTexto = equipo.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
                            (equipo.categoria?.nombre || '').toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      const coincideCategoria = this.categoriaFiltro === '' || equipo.categoria?._id === this.categoriaFiltro;
      return coincideTexto && coincideCategoria;
    });
  }

  abrirDetalles(equipo: any) {
    this.equipoSeleccionado = equipo;
    this.cdr.detectChanges();
  }

  mostrarNotificacion(mensaje: string, tipo: string = 'success') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
    this.cdr.detectChanges();
    setTimeout(() => { this.mostrarToast = false; this.cdr.detectChanges(); }, 4000); 
  }

  irALogin() {
    this.mostrarNotificacion('🔒 Necesitas iniciar sesión para solicitar equipo.', 'warning');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  prepararAgregar(equipo: any) {
    this.equipoParaAgregar = equipo;
    this.fechaSalidaTemp = '';
    this.fechaEntregaTemp = '';
    this.cantidadTemp = 1; 
    this.cdr.detectChanges();
  }

  confirmarAgregarAlCarrito() {
    if (!this.tieneSesion) {
      this.irALogin();
      return;
    }

    const estadoUsuario = localStorage.getItem('estado') || 'Activo';
    if (estadoUsuario === 'Sancionado') {
      this.mostrarNotificacion('⚠️ Acción bloqueada: No puedes solicitar material porque tu cuenta está Sancionada.', 'danger');
      return;
    }

    const yaExiste = this.carrito.find(item => item.id === this.equipoParaAgregar.id);
    if (this.cantidadTemp < 1 || this.cantidadTemp > this.equipoParaAgregar.stock) {
      this.mostrarNotificacion(`⚠️ Cantidad inválida. Máximo disponible: ${this.equipoParaAgregar.stock}`, 'warning');
      return;
    }

    if (!yaExiste) {
      this.carrito.push({
        ...this.equipoParaAgregar,
        fechaSalida: this.fechaSalidaTemp,
        fechaEntrega: this.fechaEntregaTemp,
        cantidadSolicitada: this.cantidadTemp 
      });
      this.mostrarNotificacion(`✅ ${this.cantidadTemp}x ${this.equipoParaAgregar.nombre} agregado(s).`, 'success');
    } else {
      this.mostrarNotificacion(`⚠️ El equipo ya está en tu carrito.`, 'warning');
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
      cantidad: item.cantidadSolicitada || 1 
    }));

    const payload = {
      equipos: equiposMapeados,
      fechaSalida: this.carrito[0].fechaSalida,
      fechaLimite: this.carrito[0].fechaEntrega
    };

    this.prestamosService.crearPrestamo(payload).subscribe({
      next: (respuesta) => {
        this.mostrarNotificacion('🎉 ¡Préstamo registrado exitosamente!', 'success');
        this.carrito = []; 
        this.cargarEquiposReales(); 
      },
      error: (err) => {
        console.error('Error al pedir préstamo:', err);

        if (err.status === 401) {
          this.mostrarNotificacion('🔒 Tu sesión expiró o es inválida. Redirigiendo...', 'danger');
          localStorage.clear();
          setTimeout(() => this.router.navigate(['/login']), 1500);
          return;
        }

        const mensajeReal = err.error?.msg || 'Error al procesar la solicitud';
        this.mostrarNotificacion(`${mensajeReal}`, 'danger');
      }
    });
  }
}