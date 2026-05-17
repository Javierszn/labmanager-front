import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquiposService } from '../../services/equipos.service';
import { PrestamosService } from '../../services/prestamos.service';
import { AuthService } from '../../services/auth.service';
import { CategoriasService } from '../../services/categorias.service';
import { SancionesService } from '../../services/sanciones.service'; // <-- NUEVO

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-inventory.html',
  styleUrl: './admin-inventory.css'
})
export class AdminInventory implements OnInit {
  
  terminoBusquedaSolicitudes: string = '';
  terminoBusquedaAlumnos: string = '';
  
  equipoEditando: any = { id: '', nombre: '', descripcion: '', stock: 0, img: '', categoria: '' };
  nuevaImagenTemp: string = '';
  categoriaEditando: any = { id: '', nombre: '', descripcion: '' };

  itemAEliminar: any = null;
  tipoEliminacion: 'equipo' | 'categoria' | 'sancion' = 'equipo';

  alumnoASancionar: any = null; // <-- Para el modal de nueva sanción

  equipos: any[] = [];
  solicitudes: any[] = [];
  alumnos: any[] = [];
  categorias: any[] = [];
  sanciones: any[] = []; // <-- Arreglo de sanciones

  cargandoInventario: boolean = true;
  cargandoPrestamos: boolean = true;

  mostrarToast: boolean = false;
  mensajeToast: string = '';
  tipoToast: string = 'success';

  constructor(
    private equiposService: EquiposService,
    private prestamosService: PrestamosService,
    private authService: AuthService,
    private categoriasService: CategoriasService,
    private sancionesService: SancionesService, // <-- Inyectado
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarInventarioReal();
    this.cargarPrestamosGlobalesReal();
    this.cargarAlumnos(); 
    this.cargarCategorias();
    this.cargarSanciones(); // <-- Cargar historial de sanciones
  }

  mostrarNotificacion(mensaje: string, tipo: string = 'success') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
    this.cdr.detectChanges();
    setTimeout(() => { this.mostrarToast = false; this.cdr.detectChanges(); }, 3500);
  }

  // --- MÉTODOS DE SANCIONES (NUEVOS) ---
  cargarSanciones() {
    this.sancionesService.obtenerSanciones().subscribe({
      next: (res: any) => {
        this.sanciones = res.sanciones;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });
  }

  prepararSancion(alumno: any) {
    this.alumnoASancionar = alumno;
  }

  aplicarSancion(motivo: string) {
    if (!motivo || motivo.trim() === '') {
      this.mostrarNotificacion('⚠️ Debes especificar el motivo de la sanción.', 'warning');
      return;
    }
    
    const payload = { usuario: this.alumnoASancionar._id, motivo };
    
    this.sancionesService.crearSancion(payload).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion('🔒 Sanción aplicada. El usuario ha sido bloqueado.', 'success');
        this.cargarSanciones();
        this.cargarAlumnos(); // Refrescar lista de usuarios
      },
      error: (err: any) => this.mostrarNotificacion('❌ Error al sancionar', 'danger')
    });
  }

  resolverSancion(idSancion: string) {
    this.sancionesService.resolverSancion(idSancion).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion('🔓 Sanción resuelta. El usuario ya puede pedir material.', 'success');
        this.cargarSanciones();
        this.cargarAlumnos();
      },
      error: (err: any) => this.mostrarNotificacion('❌ Error al resolver', 'danger')
    });
  }

  // --- MÉTODOS DE ELIMINACIÓN CON MODAL ---
  prepararEliminacion(item: any, tipo: 'equipo' | 'categoria' | 'sancion') {
    this.itemAEliminar = item;
    this.tipoEliminacion = tipo;
  }

  confirmarEliminacion() {
    if (!this.itemAEliminar) return;

    if (this.tipoEliminacion === 'equipo') {
      const id = this.itemAEliminar.id || this.itemAEliminar._id;
      this.equiposService.eliminarEquipo(id).subscribe({
        next: (res: any) => {
          this.mostrarNotificacion('🗑️ El equipo ha sido dado de baja correctamente.', 'success');
          this.cargarInventarioReal();
        },
        error: (err: any) => this.mostrarNotificacion('❌ Error al dar de baja el equipo.', 'danger')
      });
    } else if (this.tipoEliminacion === 'categoria') {
      this.categoriasService.eliminarCategoria(this.itemAEliminar._id).subscribe({
        next: (res: any) => {
          this.mostrarNotificacion('🗑️ Categoría eliminada.', 'success');
          this.cargarCategorias();
        },
        error: (err: any) => this.mostrarNotificacion('❌ Error al eliminar categoría.', 'danger')
      });
    } else if (this.tipoEliminacion === 'sancion') {
      this.sancionesService.eliminarSancion(this.itemAEliminar._id).subscribe({
        next: (res: any) => {
          this.mostrarNotificacion('🗑️ Registro de sanción eliminado.', 'success');
          this.cargarSanciones();
        }
      });
    }
    this.itemAEliminar = null;
  }

  // --- MÉTODOS EXISTENTES INTACTOS ---
  cargarCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (res: any) => { this.categorias = res.categorias; this.cdr.detectChanges(); }
    });
  }
  agregarCategoria(nombre: string, descripcion: string) {
    this.categoriasService.crearCategoria({ nombre, descripcion }).subscribe({
      next: (res: any) => { this.mostrarNotificacion('✅ Categoría creada exitosamente.', 'success'); this.cargarCategorias(); }
    });
  }
  abrirEditarCategoria(cat: any) { this.categoriaEditando = { id: cat._id, nombre: cat.nombre, descripcion: cat.descripcion }; }
  guardarEdicionCategoria() {
    this.categoriasService.actualizarCategoria(this.categoriaEditando.id, this.categoriaEditando).subscribe({
      next: (res: any) => { this.mostrarNotificacion('📋 Categoría actualizada.', 'success'); this.cargarCategorias(); }
    });
  }

  cargarInventarioReal() {
    this.equiposService.obtenerEquipos().subscribe({
      next: (res: any) => {
        this.equipos = res.equipos.map((eq: any) => ({ ...eq, id: eq._id, stock: eq.stockDisponible, img: eq.img || eq.imagenUrl || 'https://placehold.co/600x400' }));
        this.cargandoInventario = false;
        this.cdr.detectChanges();
      }
    });
  }
  agregarEquipo(nombre: string, descripcion: string, stock: string, categoriaId: string) {
    if (!categoriaId) { this.mostrarNotificacion('⚠️ Debes seleccionar una categoría.', 'warning'); return; }
    const payload = { nombre, descripcion, categoria: categoriaId, stockTotal: parseInt(stock) || 0, stockDisponible: parseInt(stock) || 0, img: this.nuevaImagenTemp || 'https://placehold.co/600x400', imagenUrl: this.nuevaImagenTemp || 'https://placehold.co/600x400' };
    this.equiposService.crearEquipo(payload).subscribe({
      next: (res: any) => { this.mostrarNotificacion('✅ Equipo guardado exitosamente.', 'success'); this.cargarInventarioReal(); this.nuevaImagenTemp = ''; }
    });
  }
  guardarEdicion() {
    const payload = { nombre: this.equipoEditando.nombre, descripcion: this.equipoEditando.descripcion, categoria: this.equipoEditando.categoria, stockDisponible: this.equipoEditando.stock, img: this.equipoEditando.img, imagenUrl: this.equipoEditando.img };
    this.equiposService.actualizarEquipo(this.equipoEditando.id, payload).subscribe({
      next: (res: any) => { this.mostrarNotificacion('📋 Cambios del equipo guardados.', 'success'); this.cargarInventarioReal(); }
    });
  }

  cargarPrestamosGlobalesReal() {
    this.prestamosService.obtenerTodosPrestamos().subscribe({
      next: (res: any) => { this.solicitudes = res.prestamos; this.cargandoPrestamos = false; this.cdr.detectChanges(); }
    });
  }
  cargarAlumnos() {
    this.authService.obtenerAlumnos().subscribe({
      next: (res: any) => { this.alumnos = res.alumnos; this.cdr.detectChanges(); }
    });
  }

  get totalPendientes() { return this.solicitudes.filter(s => s.estado === 'Pendiente').length; }
  get totalPrestados() { return this.solicitudes.filter(s => s.estado === 'Activo').length; }
  get totalSancionados() { return this.alumnos.filter(a => a.estado === 'Sancionado').length; }

  get solicitudesFiltradas() {
    return this.solicitudes.filter(sol => {
      const termino = this.terminoBusquedaSolicitudes.toLowerCase();
      const folioId = sol._id ? sol._id.substring(0, 7).toLowerCase() : '';
      const nombreAlumno = sol.usuario?.nombre ? sol.usuario.nombre.toLowerCase() : '';
      const primerEquipo = sol.equipos && sol.equipos[0]?.equipo?.nombre ? sol.equipos[0].equipo.nombre.toLowerCase() : '';
      return folioId.includes(termino) || nombreAlumno.includes(termino) || primerEquipo.includes(termino);
    });
  }
  get alumnosFiltrados() {
    return this.alumnos.filter(alumno => {
      const termino = this.terminoBusquedaAlumnos.toLowerCase();
      const nombre = alumno.nombre ? alumno.nombre.toLowerCase() : '';
      const correo = alumno.correo ? alumno.correo.toLowerCase() : '';
      const matricula = alumno.matricula ? alumno.matricula.toLowerCase() : '';
      return nombre.includes(termino) || correo.includes(termino) || matricula.includes(termino);
    });
  }

  procesarEstadoPrestamo(idPrestamo: string, nuevoEstado: string) {
    this.prestamosService.actualizarEstadoPrestamo(idPrestamo, nuevoEstado).subscribe({
      next: (res: any) => { this.mostrarNotificacion(`🟢 Solicitud actualizada a [${nuevoEstado.toUpperCase()}] con éxito.`, 'success'); this.cargarPrestamosGlobalesReal(); this.cargarInventarioReal(); }
    });
  }
  abrirEditar(equipo: any) { this.equipoEditando = { ...equipo, categoria: equipo.categoria?._id || '' }; }

  onFileSelected(event: any, tipo: 'nuevo' | 'editar') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (tipo === 'nuevo') { this.nuevaImagenTemp = e.target.result; } else { this.equipoEditando.img = e.target.result; }
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);
    }
  }
}