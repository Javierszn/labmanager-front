import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { AdminInventory } from './pages/admin-inventory/admin-inventory';
import { UserHistory } from './pages/user-history/user-history';
import { Catalogo } from './pages/catalogo/catalogo';
import { Perfil } from './pages/perfil/perfil';

// ---------------------------------------------------------
// GUARDIAS DE RUTA FUNCIONALES (Seguridad Frontend)
// ---------------------------------------------------------

// Guardia 1: Verifica que el usuario tenga una sesión activa (Token)
const authGuard = () => {
  const token = localStorage.getItem('token');
  if (token) return true; 
  
  // Si no hay token, lo mandamos a iniciar sesión
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};

// Guardia 2: Verifica que el usuario tenga el rol de Administrador
const adminGuard = () => {
  const rol = localStorage.getItem('rol');
  if (rol === 'admin') return true; 
  
  // Si es un alumno queriendo entrar al panel, lo regresamos al inicio
  const router = inject(Router);
  router.navigate(['/home']);
  return false;
};

// Guardia 3: Evita que alguien logueado vuelva a ver la pantalla de Login
const noAuthGuard = () => {
  const token = localStorage.getItem('token');
  if (!token) return true; // Si no hay token, adelante, pasa al login
  
  // Si ya hay token (ya inició sesión), lo mandamos al inicio
  const router = inject(Router);
  router.navigate(['/home']);
  return false;
};

// ---------------------------------------------------------
// DEFINICIÓN DE RUTAS
// ---------------------------------------------------------
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  
  // PÚBLICAS (Todos pueden ver, visitantes y logueados)
  { path: 'home', component: Home }, 
  { path: 'catalogo', component: Catalogo },
  
  // SOLO VISITANTES (No puedes ver el login si ya entraste)
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  
  // SOLO ADMIN (Nivel máximo de acceso)
  // Nota: Pasa por los 2 filtros: ¿Está logueado? -> Sí -> ¿Es admin? -> Sí -> Entra.
  { path: 'admin/inventario', component: AdminInventory, canActivate: [authGuard, adminGuard] },
  
  // PRIVADAS (Requiere estar logueado, sea alumno o admin)
  { path: 'alumno/historial', component: UserHistory, canActivate: [authGuard] },
  { path: 'alumno/perfil', component: Perfil, canActivate: [authGuard] }, 
  
  // RUTA COMODÍN (Si escriben una URL que no existe, los manda al inicio)
  { path: '**', redirectTo: 'home', pathMatch: 'full' } 
];