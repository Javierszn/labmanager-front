import { Component } from '@angular/core';
import { Router } from '@angular/router'; // <-- Quitamos RouterLink de aquí
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Y lo quitamos de este arreglo también
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  authMode: 'login' | 'register' | 'forgot' = 'login';
  
  // Variables capturadas del formulario
  correoLogin: string = '';
  passwordLogin: string = '';

  constructor(private router: Router) {}

  setMode(mode: 'login' | 'register' | 'forgot') {
    this.authMode = mode;
  }

 iniciarSesionReal() {
    if (!this.correoLogin || !this.passwordLogin) {
      alert('⚠️ Por favor ingresa tu correo y contraseña.');
      return;
    }

    // --- SIMULACIÓN DEL BACKEND ---
    const correo = this.correoLogin.toLowerCase();
    
    // 1. Asignamos el rol dependiendo del correo
    if (correo.includes('admin')) {
      localStorage.setItem('rol', 'admin');
    } 
    else {
      localStorage.setItem('rol', 'alumno');
    }

    // 2. Sin importar el rol, los mandamos a todos al Home
    window.location.href = '/home'; 
  }

  recuperarPassword() {
    alert('✉️ Te hemos enviado un enlace seguro a tu correo para restablecer tu contraseña.');
    this.setMode('login'); 
  }
}