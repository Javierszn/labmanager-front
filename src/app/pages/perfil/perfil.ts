import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { SancionesService } from '../../services/sanciones.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  
  fotoPorDefecto: string = 'https://placehold.co/128x128/003b5c/ffffff?text=Perfil';

  usuario: any = {
    nombre: '', 
    correo: '',
    matricula: '',
    estado: 'Activo',
    rol: '',
    telefono: '',
    institucion: '',
    facultad: '',
    foto: this.fotoPorDefecto
  };

  passwords = { nueva: '', confirmar: '' };
  misSanciones: any[] = [];
  cargando: boolean = true;

  mostrarToast: boolean = false;
  mensajeToast: string = '';
  tipoToast: string = 'success';

  constructor(
    private router: Router,
    private authService: AuthService,
    private sancionesService: SancionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPerfil();
    this.cargarMisSanciones();
  }

  mostrarNotificacion(mensaje: string, tipo: string = 'success') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
    this.cdr.detectChanges();
    setTimeout(() => { this.mostrarToast = false; this.cdr.detectChanges(); }, 3500);
  }

  cargarPerfil() {
    this.authService.obtenerMiPerfil().subscribe({
      next: (res: any) => {
        this.usuario = { ...this.usuario, ...res.usuario };
        localStorage.setItem('estado', this.usuario.estado); 
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar perfil', err);
        this.mostrarNotificacion('⚠️ Error al cargar tu información', 'danger');
      }
    });
  }

  cargarMisSanciones() {
    this.sancionesService.obtenerMisSanciones().subscribe({
      next: (res: any) => {
        this.misSanciones = res.sanciones;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar sanciones', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
    window.location.href = '/login'; 
  }

  eliminarCuenta() {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción borrará todos tus datos y no se puede deshacer.');
    
    if (confirmacion) {
      this.authService.eliminarMiCuenta().subscribe({
        next: (res: any) => {
          this.mostrarNotificacion('Cuenta eliminada con éxito', 'success');
          setTimeout(() => {
            this.authService.logout();
            window.location.href = '/login';
          }, 1500);
        },
        error: (err: any) => {
          console.error(err);
          this.mostrarNotificacion('Error al intentar eliminar la cuenta', 'danger');
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuario.foto = e.target.result;
        this.cdr.detectChanges();
        this.guardarFotoAutomatico();
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarFoto() {
    this.usuario.foto = this.fotoPorDefecto; 
    this.cdr.detectChanges();
    this.guardarFotoAutomatico(); 
  }

  guardarFotoAutomatico() {
    this.authService.actualizarMiPerfil(this.usuario).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion('📸 Foto de perfil actualizada.', 'success');
      },
      error: (err: any) => {
        console.error(err);
        this.mostrarNotificacion('❌ Error al actualizar la foto.', 'danger');
      }
    });
  }

  guardarPerfil() {
    this.authService.actualizarMiPerfil(this.usuario).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion('✅ Tus datos personales han sido actualizados.', 'success');
      },
      error: (err: any) => {
        console.error(err);
        this.mostrarNotificacion('❌ Error al actualizar el perfil.', 'danger');
      }
    });
  }

  guardarPassword() {
    if (!this.passwords.nueva || !this.passwords.confirmar) {
      this.mostrarNotificacion('⚠️ Llena ambos campos de contraseña.', 'warning');
      return;
    }
    if (this.passwords.nueva !== this.passwords.confirmar) {
      this.mostrarNotificacion('❌ Las contraseñas no coinciden.', 'danger');
      return;
    }

    this.authService.actualizarPassword(this.passwords.nueva).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion('✅ Contraseña actualizada correctamente.', 'success');
        this.passwords = { nueva: '', confirmar: '' }; 
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.mostrarNotificacion('❌ Error al actualizar la contraseña.', 'danger');
      }
    });
  }
}