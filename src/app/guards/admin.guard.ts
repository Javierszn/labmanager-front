import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const rol = localStorage.getItem('rol');

  
  if (rol === 'admin') {
    return true;
  } else {
    
    router.navigate(['/catalogo']);
    return false;
  }
};