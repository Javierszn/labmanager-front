import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const rol = localStorage.getItem('rol');

  // Si el rol guardado en el LocalStorage es 'admin', pasa
  if (rol === 'admin') {
    return true;
  } else {
    // Si es un alumno queriendo pasarse de listo, lo regresamos al catálogo
    router.navigate(['/catalogo']);
    return false;
  }
};