import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquiposService } from '../../services/equipos.service';
import { PrestamosService } from '../../services/prestamos.service';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-inventory.html',
  styleUrl: './admin-inventory.css'
})
export class AdminInventory implements OnInit {
  
  // Variables para la interfaz de búsqueda
  terminoBusquedaSolicitudes: string = '';
  equipoEditando: any = { id: '', nombre: '', descripcion: '', stock: 0, img: '' };
  nuevaImagenTemp: string = '';

  // Arreglos dinámicos conectados al Backend
  equipos: any[] = [];
  solicitudes: any[] = [];
  alumnos: any[] = []; // Puedes usarlo más adelante si creas rutas de usuarios

  // Controladores de carga
  cargandoInventario: boolean = true;
  cargandoPrestamos: boolean = true;

  // Sistema de Toasts Dinámicos y Llamativos
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  tipoToast: string = 'success';

  constructor(
    private equiposService: EquiposService,
    private prestamosService: PrestamosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarInventarioReal();
    this.cargarPrestamosGlobalesReal();
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

  // --- TRAER INVENTARIO DESDE MONGO ---
  cargarInventarioReal() {
    this.equiposService.obtenerEquipos().subscribe({
      next: (res) => {
        this.equipos = res.equipos.map((eq: any) => ({
          ...eq,
          id: eq._id,
          stock: eq.stockDisponible,
          img: eq.img || eq.imagenUrl || 'https://placehold.co/600x400/eeeeee/000000?text=Sin+Imagen'
        }));
        this.cargandoInventario = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mostrarNotificacion('⚠️ Error al conectar con el inventario', 'danger');
        this.cargandoInventario = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- TRAER TODOS LOS PRÉSTAMOS DE LA UNIVERSIDAD DESDE MONGO ---
  cargarPrestamosGlobalesReal() {
    this.prestamosService.obtenerTodosPrestamos().subscribe({
      next: (res) => {
        this.solicitudes = res.prestamos;
        this.cargandoPrestamos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mostrarNotificacion('⚠️ Error al cargar solicitudes globales', 'danger');
        this.cargandoPrestamos = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- GETTERS DINÁMICOS PARA LAS TARJETAS KPI ---
  get totalPendientes() { return this.solicitudes.filter(s => s.estado === 'Pendiente').length; }
  get totalPrestados() { return this.solicitudes.filter(s => s.estado === 'Activo').length; }
  get totalSancionados() { return this.alumnos.filter(a => a.estado === 'Sancionado').length; }

  // --- BUSCADOR DINÁMICO ---
  get solicitudesFiltradas() {
    return this.solicitudes.filter(sol => {
      const termino = this.terminoBusquedaSolicitudes.toLowerCase();
      const folioId = sol._id ? sol._id.substring(0, 7).toLowerCase() : '';
      const nombreAlumno = sol.usuario?.nombre ? sol.usuario.nombre.toLowerCase() : '';
      const primerEquipo = sol.equipos && sol.equipos[0]?.equipo?.nombre ? sol.equipos[0].equipo.nombre.toLowerCase() : '';
      
      return folioId.includes(termino) || nombreAlumno.includes(termino) || primerEquipo.includes(termino);
    });
  }

  // --- ACCIONES EN CALIENTE DEL LABORATORISTA ---
  procesarEstadoPrestamo(idPrestamo: string, nuevoEstado: string) {
    this.prestamosService.actualizarEstadoPrestamo(idPrestamo, nuevoEstado).subscribe({
      next: (res) => {
        this.mostrarNotificacion(`🟢 Solicitud actualizada a [${nuevoEstado.toUpperCase()}] con éxito.`, 'success');
        this.cargarPrestamosGlobalesReal(); // Recarga la tabla de préstamos
        this.cargarInventarioReal();       // Recarga el inventario por si varió el stock
      },
      error: (err) => {
        console.error(err);
        this.mostrarNotificacion('❌ Hubo un error al cambiar el estado en el servidor.', 'danger');
      }
    });
  }

  // --- MANEJO DE IMÁGENES Y LOGICA LOCAL EXISTENTE ---
  onFileSelected(event: any, tipo: 'nuevo' | 'editar') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (tipo === 'nuevo') this.nuevaImagenTemp = e.target.result;
        else this.equipoEditando.img = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  agregarEquipo(nombre: string, descripcion: string, stock: string) {
    const nuevoId = 'EQ-00' + (this.equipos.length + 1);
    this.equipos.push({ 
      id: nuevoId, nombre, descripcion, stock: parseInt(stock) || 0,
      img: this.nuevaImagenTemp || 'https://placehold.co/600x400/eeeeee/000000?text=Sin+Imagen'
    });
    this.nuevaImagenTemp = '';
    this.mostrarNotificacion('✅ Equipo simulado en local.', 'success');
  }

  abrirEditar(equipo: any) { this.equipoEditando = { ...equipo }; }
  
  guardarEdicion() {
    const index = this.equipos.findIndex(e => e.id === this.equipoEditando.id);
    if (index !== -1) {
      this.equipos[index] = { ...this.equipoEditando };
      this.mostrarNotificacion('📋 Cambios del equipo guardados.', 'success');
    }
  }

  cambiarEstadoAlumno(alumno: any) {
    alumno.estado = alumno.estado === 'Activo' ? 'Sancionado' : 'Activo';
  }
}