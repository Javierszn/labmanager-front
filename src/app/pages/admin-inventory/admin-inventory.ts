import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-inventory.html',
  styleUrl: './admin-inventory.css'
})
export class AdminInventory {
  
  // Variables para la interfaz
  terminoBusquedaSolicitudes: string = '';
  equipoEditando: any = { id: '', nombre: '', descripcion: '', stock: 0, img: '' };
  nuevaImagenTemp: string = '';

  equipos = [
    { id: 'EQ-001', nombre: 'Multímetro Fluke 87V', descripcion: 'Multímetro digital industrial', stock: 5, img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80' },
    { id: 'EQ-002', nombre: 'Osciloscopio Tektronix', descripcion: 'Digital, 2 canales, 100MHz', stock: 2, img: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=500&q=80' }
  ];

  // DATOS SINCRONIZADOS CON EL HISTORIAL DEL ALUMNO
  solicitudes = [
    { folio: '2026-899', alumno: 'Javier García', equipo: 'Osciloscopio Tektronix', fechaSalida: '2026-02-14', fechaEntrega: '2026-02-17', estado: 'Aprobado' },
    { folio: '2026-850', alumno: 'Javier García', equipo: 'Fuente de Poder', fechaSalida: '2026-02-10', fechaEntrega: '2026-02-11', estado: 'Devuelto' },
    { folio: '2026-700', alumno: 'Javier García', equipo: 'Kit Raspberry Pi', fechaSalida: '2026-02-01', fechaEntrega: '2026-02-04', estado: 'Sancionado' },
    { folio: '2026-905', alumno: 'María López', equipo: 'Arduino Uno R3', fechaSalida: '2026-03-25', fechaEntrega: '2026-03-28', estado: 'Pendiente' },
    { folio: '2026-910', alumno: 'Carlos Ruiz', equipo: 'Multímetro Fluke 87V', fechaSalida: '2026-03-26', fechaEntrega: '2026-03-27', estado: 'Pendiente' }
  ];

  alumnos = [
    { matricula: '320123', nombre: 'Javier García', correo: 'javier@alumnos.uaslp.mx', estado: 'Sancionado' }, // Sancionado por el Raspberry
    { matricula: '320456', nombre: 'María López', correo: 'maria@alumnos.uaslp.mx', estado: 'Activo' },
    { matricula: '320789', nombre: 'Carlos Ruiz', correo: 'carlos@alumnos.uaslp.mx', estado: 'Activo' }
  ];

  // --- GETTERS PARA LAS TARJETAS DE RESUMEN ---
  get totalPendientes() { return this.solicitudes.filter(s => s.estado === 'Pendiente').length; }
  get totalPrestados() { return this.solicitudes.filter(s => s.estado === 'Aprobado').length; }
  get totalSancionados() { return this.alumnos.filter(a => a.estado === 'Sancionado').length; }

  // --- GETTER PARA EL BUSCADOR DE SOLICITUDES ---
  get solicitudesFiltradas() {
    return this.solicitudes.filter(sol => 
      sol.folio.toLowerCase().includes(this.terminoBusquedaSolicitudes.toLowerCase()) ||
      sol.alumno.toLowerCase().includes(this.terminoBusquedaSolicitudes.toLowerCase()) ||
      sol.equipo.toLowerCase().includes(this.terminoBusquedaSolicitudes.toLowerCase())
    );
  }

  // --- FUNCIONES EXISTENTES ---
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
  }

  abrirEditar(equipo: any) { this.equipoEditando = { ...equipo }; }
  
  guardarEdicion() {
    const index = this.equipos.findIndex(e => e.id === this.equipoEditando.id);
    if (index !== -1) this.equipos[index] = { ...this.equipoEditando };
  }

  // Ahora con colores para mantener coherencia si cambias el estado
  aprobarSolicitud(solicitud: any) { solicitud.estado = 'Aprobado'; }
  rechazarSolicitud(solicitud: any) { solicitud.estado = 'Rechazado'; }
  marcarDevuelto(solicitud: any) { solicitud.estado = 'Devuelto'; }

  cambiarEstadoAlumno(alumno: any) {
    alumno.estado = alumno.estado === 'Activo' ? 'Sancionado' : 'Activo';
  }
}