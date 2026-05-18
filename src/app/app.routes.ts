import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { AdminInventory } from './pages/admin-inventory/admin-inventory';
import { UserHistory } from './pages/user-history/user-history';
import { Catalogo } from './pages/catalogo/catalogo';
import { Perfil } from './pages/perfil/perfil';

const authGuard = () => {
  const token = localStorage.getItem('token');
  if (token) return true; 
  
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};

const adminGuard = () => {
  const rol = localStorage.getItem('rol');
  if (rol === 'admin') return true; 
  
  const router = inject(Router);
  router.navigate(['/home']);
  return false;
};

const noAuthGuard = () => {
  const token = localStorage.getItem('token');
  if (!token) return true; 
  
  const router = inject(Router);
  router.navigate(['/home']);
  return false;
};

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: Home }, 
  { path: 'catalogo', component: Catalogo },
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'admin/inventario', component: AdminInventory, canActivate: [authGuard, adminGuard] },
  { path: 'alumno/historial', component: UserHistory, canActivate: [authGuard] },
  { path: 'alumno/perfil', component: Perfil, canActivate: [authGuard] }, 
  { path: '**', redirectTo: 'home', pathMatch: 'full' } 
];