import { Component, ChangeDetectorRef, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router'; 
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
export class Login implements OnInit {
  
  // Se agregó el modo 'reset'
  authMode: 'login' | 'register' | 'forgot' | 'reset' = 'login';
  
  correoLogin: string = '';
  passwordLogin: string = '';

  regNombre: string = '';
  regApPaterno: string = '';
  regApMaterno: string = '';
  regCorreo: string = '';
  regPassword: string = '';
  regMatricula: string = ''; 
  regInstitucion: string = ''; 
  regFacultad: string = '';    

  // Variables Recuperación
  correoRecuperar: string = '';
  tokenRecuperacion: string = '';
  passResetNueva: string = '';
  passResetConf: string = '';

  formEnviado: boolean = false;
  notificacion = { mostrar: false, mensaje: '', tipo: 'success' };

  constructor(
    private router: Router, 
    private route: ActivatedRoute, // Para leer parámetros de la URL
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    // Escuchamos si en la URL viene el token (ej. /login?token=abc123)
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.tokenRecuperacion = params['token'];
        this.setMode('reset'); // Cambiamos a la vista de poner nueva contraseña
      }
    });
  }

  setMode(mode: 'login' | 'register' | 'forgot' | 'reset') {
    this.authMode = mode;
    this.formEnviado = false; 
    
    // Si queremos salir de 'reset', limpiamos el token de la URL
    if (mode === 'login' && this.tokenRecuperacion) {
      this.tokenRecuperacion = '';
      this.router.navigate(['/login']);
    }

    this.cdr.detectChanges(); 
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'danger' | 'warning') {
    this.notificacion = { mostrar: true, mensaje, tipo };
    this.cdr.detectChanges(); 
    setTimeout(() => {
      this.notificacion.mostrar = false;
      this.cdr.detectChanges(); 
    }, 4000);
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
        setTimeout(() => { window.location.href = '/home'; }, 1500); 
      },
      error: (err) => {
        console.error(err);
        const mensajeReal = err.error?.msg || 'Credenciales incorrectas';
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
          this.regNombre = ''; this.regApPaterno = ''; this.regApMaterno = '';
          this.regCorreo = ''; this.regPassword = ''; this.regMatricula = '';
          this.regInstitucion = ''; this.regFacultad = ''; 
          this.cdr.detectChanges(); 
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        const mensajeReal = err.error?.msg || 'Error al registrar usuario';
        this.mostrarNotificacion(mensajeReal, 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  // ENVÍA EL CORREO
  solicitarRecuperacion() {
    if (!this.correoRecuperar) {
      this.mostrarNotificacion('Por favor ingresa un correo electrónico válido.', 'warning');
      return;
    }

    this.authService.solicitarRecuperacion(this.correoRecuperar).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion(res.msg, 'success');
        setTimeout(() => this.setMode('login'), 3000); 
      },
      error: (err: any) => {
        this.mostrarNotificacion('Error al intentar enviar el correo de recuperación.', 'danger');
      }
    });
  }

  // GUARDA LA NUEVA CONTRASEÑA CUANDO VIENEN DEL LINK
  guardarNuevaPassword() {
    if (!this.passResetNueva || !this.passResetConf) {
      this.mostrarNotificacion('Llena ambos campos.', 'warning');
      return;
    }

    if (this.passResetNueva !== this.passResetConf) {
      this.mostrarNotificacion('Las contraseñas no coinciden.', 'danger');
      return;
    }

    this.authService.resetearPasswordOlvidada(this.tokenRecuperacion, this.passResetNueva).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion('¡Contraseña restablecida correctamente!', 'success');
        setTimeout(() => {
          this.tokenRecuperacion = '';
          this.router.navigate(['/login']); // Quitamos el token de la url
          this.setMode('login');
        }, 2000);
      },
      error: (err: any) => {
        const msg = err.error?.msg || 'Error al cambiar contraseña. Intenta solicitar otro enlace.';
        this.mostrarNotificacion(msg, 'danger');
      }
    });
  }
}