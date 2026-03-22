import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { AdminInventory } from './pages/admin-inventory/admin-inventory';
import { UserHistory } from './pages/user-history/user-history';
import { Catalogo } from './pages/catalogo/catalogo';
import { Perfil } from './pages/perfil/perfil';

// ---------------------------------------------------------
// GUARDIAS DE RUTA (Seguridad simulada con localStorage)
// ---------------------------------------------------------

// Guardia: Solo usuarios logueados (Alumno o Admin)
const authGuard = () => {
  const rol = localStorage.getItem('rol');
  if (rol === 'alumno' || rol === 'admin') return true;
  
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};

// Guardia: Solo Administradores
const adminGuard = () => {
  const rol = localStorage.getItem('rol');
  if (rol === 'admin') return true;
  
  const router = inject(Router);
  router.navigate(['/home']);
  return false;
};

// Guardia: Evita que alguien logueado vuelva a ver el Login
const noAuthGuard = () => {
  const rol = localStorage.getItem('rol');
  if (!rol || rol === 'visitante') return true;
  
  const router = inject(Router);
  router.navigate(['/home']);
  return false;
};

// ---------------------------------------------------------
// DEFINICIÓN DE RUTAS
// ---------------------------------------------------------
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  
  // PÚBLICAS (Todos pueden ver)
  { path: 'home', component: Home }, 
  { path: 'catalogo', component: Catalogo },
  
  // SOLO VISITANTES (Si ya entraste, no puedes ver el login de nuevo)
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  
  // SOLO ADMIN (Nivel máximo de acceso)
  { path: 'admin/inventario', component: AdminInventory, canActivate: [adminGuard] },
  
  // PRIVADAS (Requiere ser Alumno o Admin)
  { path: 'alumno/historial', component: UserHistory, canActivate: [authGuard] },
  { path: 'alumno/perfil', component: Perfil, canActivate: [authGuard] }, 
  
  { path: '**', redirectTo: 'home', pathMatch: 'full' } 
];