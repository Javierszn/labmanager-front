import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-history.html',
  styleUrl: './user-history.css'
})
export class UserHistory {
  alumno = 'Javier Eduardo García Rivera'; 
  
  prestamos = [
    { folio: '2026-899', items: '1x Osciloscopio, 2x Puntas', fechaSalida: '14 Feb 2026', limite: '17 Feb 2026', estado: 'ACTIVO', color: 'success' },
    { folio: '2026-850', items: '1x Fuente de Poder', fechaSalida: '10 Feb 2026', limite: '11 Feb 2026', estado: 'DEVUELTO', color: 'secondary' },
    { folio: '2026-700', items: '1x Kit Raspberry Pi', fechaSalida: '01 Feb 2026', limite: '04 Feb 2026', estado: 'SANCIONADO', color: 'danger' }
  ];
}