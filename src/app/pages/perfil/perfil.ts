import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE para editar en tiempo real

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Agrégalo aquí
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  
  // Estructura actualizada sin matrícula y con los nuevos campos separados
  usuario = {
    nombres: 'Javier', 
    apellidoPaterno: 'García',
    apellidoMaterno: 'Rivera',
    telefono: '4441234567',
    correo: 'javier.garcia@gmail.com',
    facultad: 'Facultad de Ingeniería',
    institucion: 'UASLP',
    estado: 'Activo',
    deuda: 0,
    foto: 'https://ui-avatars.com/api/?name=Javier+Garcia&background=003b5c&color=fff&size=128'
  };

  constructor(private router: Router) {}

  cerrarSesion() {
    alert('Has cerrado sesión correctamente.');
    this.router.navigate(['/login']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuario.foto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarPerfil() {
    alert('✅ Tus datos personales han sido actualizados.');
  }

  guardarPassword() {
    alert('✅ Contraseña actualizada correctamente.');
  }
}