import { Component, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  authMode: 'login' | 'register' | 'forgot' = 'login';
  
  // Variables Login
  correoLogin: string = '';
  passwordLogin: string = '';

  // Variables Registro
  regNombre: string = '';
  regApPaterno: string = '';
  regApMaterno: string = '';
  regCorreo: string = '';
  regPassword: string = '';
  regMatricula: string = ''; 
  regInstitucion: string = ''; // <-- Restaurado
  regFacultad: string = '';    // <-- Restaurado

  // Control de validaciones visuales
  formEnviado: boolean = false;

  notificacion = { mostrar: false, mensaje: '', tipo: 'success' };

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  setMode(mode: 'login' | 'register' | 'forgot') {
    this.authMode = mode;
    this.formEnviado = false; 
    this.cdr.detectChanges(); 
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'danger' | 'warning') {
    this.notificacion = { mostrar: true, mensaje, tipo };
    this.cdr.detectChanges(); 

    setTimeout(() => {
      this.notificacion.mostrar = false;
      this.cdr.detectChanges(); 
    }, 3500);
  }

  iniciarSesionReal() {
    this.formEnviado = true;
    this.cdr.detectChanges(); 

    if (!this.correoLogin || !this.passwordLogin) {
      this.mostrarNotificacion('Por favor llena los campos en rojo.', 'warning');
      return;
    }

    const correo = this.correoLogin.trim().toLowerCase();

    this.authService.login(correo, this.passwordLogin).subscribe({
      next: (respuesta) => {
        this.mostrarNotificacion('¡Bienvenido de vuelta!', 'success');
        
        setTimeout(() => {
          window.location.href = '/home';
        }, 1500); 
      },
      error: (err) => {
        console.error('ERROR DE LOGIN:', err);
        const mensajeReal = err.error?.msg || err.message || 'Credenciales incorrectas';
        this.mostrarNotificacion(mensajeReal, 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  registrarReal() {
    this.formEnviado = true;
    this.cdr.detectChanges(); 

    if (!this.regNombre || !this.regCorreo || !this.regPassword) {
      this.mostrarNotificacion('Por favor llena los campos obligatorios en rojo.', 'warning');
      return;
    }

    const nombreCompleto = `${this.regNombre} ${this.regApPaterno} ${this.regApMaterno}`.trim();
    const correo = this.regCorreo.trim().toLowerCase();

    this.authService.registro(nombreCompleto, correo, this.regPassword, this.regMatricula).subscribe({
      next: (respuesta) => {
        this.mostrarNotificacion('🎉 ¡Cuenta creada! Ya puedes iniciar sesión.', 'success');
        this.formEnviado = false;
        
        setTimeout(() => {
          this.authMode = 'login';
          this.correoLogin = correo; 
          this.passwordLogin = '';
          
          // Limpieza de TODOS los campos de registro
          this.regNombre = '';
          this.regApPaterno = '';
          this.regApMaterno = '';
          this.regCorreo = '';
          this.regPassword = '';
          this.regMatricula = '';
          this.regInstitucion = ''; // <-- Limpiamos
          this.regFacultad = '';    // <-- Limpiamos
          
          this.cdr.detectChanges(); 
        }, 2000);
      },
      error: (err) => {
        console.error('ERROR DE REGISTRO:', err);
        const mensajeReal = err.error?.msg || err.message || 'Error al registrar usuario';
        this.mostrarNotificacion(mensajeReal, 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  recuperarPassword() {
    this.mostrarNotificacion('Enlace seguro enviado a tu correo.', 'success');
    setTimeout(() => this.setMode('login'), 2000); 
  }
}