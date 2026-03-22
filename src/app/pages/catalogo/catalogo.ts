import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo {
  terminoBusqueda: string = '';
  mostrarToast: boolean = false;
  mensajeToast: string = '';

  equipoSeleccionado: any = null;
  
  equipoParaAgregar: any = null;
  fechaSalidaTemp: string = '';
  fechaEntregaTemp: string = '';

  // ¡AQUÍ ESTÁN LAS IMÁGENES REALES!
  equipos = [
    { 
      id: 1, nombre: 'Multímetro Fluke 87V', categoria: 'Medición', stock: 5, 
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Digital_Multimeter_Aka.jpg/800px-Digital_Multimeter_Aka.jpg', 
      marca: 'Fluke', modelo: '87V', 
      descripcion: 'Multímetro digital industrial de verdadero valor eficaz. Ideal para entornos complejos y electrónica de precisión.', 
      accesorios: 'Puntas de prueba TL75, pinzas de caimán, sonda de temperatura.' 
    },
    { 
      id: 2, nombre: 'Osciloscopio Tektronix', categoria: 'Medición', stock: 2, 
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Tektronix_TDS3054B_oscilloscope.jpg/800px-Tektronix_TDS3054B_oscilloscope.jpg', 
      marca: 'Tektronix', modelo: 'TBS1052B', 
      descripcion: 'Osciloscopio de almacenamiento digital de 2 canales y 50 MHz. Muestreo de 1 GS/s.', 
      accesorios: '2 sondas pasivas, cable de alimentación estándar.' 
    },
    { 
      id: 3, nombre: 'Cautín Weller 60W', categoria: 'Herramientas', stock: 0, 
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Soldering_iron_with_stand.jpg/800px-Soldering_iron_with_stand.jpg', 
      marca: 'Weller', modelo: 'WLC100', 
      descripcion: 'Estación de soldadura analógica de 60 watts. Temperatura ajustable hasta 900°F.', 
      accesorios: 'Base para cautín, esponja limpiadora.' 
    },
    { 
      id: 4, nombre: 'Arduino Uno R3', categoria: 'Tarjetas', stock: 15, 
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/800px-Arduino_Uno_-_R3.jpg', 
      marca: 'Arduino', modelo: 'Uno Rev3', 
      descripcion: 'Placa de desarrollo basada en el microcontrolador ATmega328P. Cuenta con 14 pines de entrada/salida digital.', 
      accesorios: 'Cable USB A-B azul.' 
    },
    { 
      id: 5, nombre: 'Raspberry Pi 4', categoria: 'Tarjetas', stock: 3, 
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Raspberry_Pi_4_Model_B_-_Side.jpg/800px-Raspberry_Pi_4_Model_B_-_Side.jpg', 
      marca: 'Raspberry', modelo: 'Pi 4 Model B', 
      descripcion: 'Computadora de placa reducida con 4GB de RAM, procesador ARM Cortex-A72 quad-core, Wi-Fi y Bluetooth.', 
      accesorios: 'Cargador USB-C, case de acrílico.' 
    },
    { 
      id: 6, nombre: 'Fuente de Poder', categoria: 'Fuentes', stock: 4, 
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Labornetzger%C3%A4t.jpg/800px-Labornetzger%C3%A4t.jpg', 
      marca: 'Steren', modelo: 'CA-200', 
      descripcion: 'Fuente de poder regulada variable. Salida de voltaje de 0 a 30V y corriente de 0 a 5A.', 
      accesorios: 'Cables caimán-caimán (rojo y negro).' 
    }
  ];

  carrito: any[] = [];

  get equiposFiltrados() {
    return this.equipos.filter(equipo => 
      equipo.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
      equipo.categoria.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  abrirDetalles(equipo: any) {
    this.equipoSeleccionado = equipo;
  }

  mostrarNotificacion(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    setTimeout(() => { this.mostrarToast = false; }, 3000);
  }

  prepararAgregar(equipo: any) {
    this.equipoParaAgregar = equipo;
    this.fechaSalidaTemp = '';
    this.fechaEntregaTemp = '';
  }

  confirmarAgregarAlCarrito() {
    const yaExiste = this.carrito.find(item => item.id === this.equipoParaAgregar.id);
    
    if (!yaExiste && this.equipoParaAgregar.stock > 0) {
      this.carrito.push({
        ...this.equipoParaAgregar,
        fechaSalida: this.fechaSalidaTemp,
        fechaEntrega: this.fechaEntregaTemp
      });
      this.mostrarNotificacion(`✅ ${this.equipoParaAgregar.nombre} agregado con sus fechas.`);
    } else if (yaExiste) {
      this.mostrarNotificacion(`⚠️ El equipo ${this.equipoParaAgregar.nombre} ya está en tu lista.`);
    }
  }

  quitarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  confirmarPrestamo() {
    if (this.carrito.length > 0) {
      this.mostrarNotificacion(`🎉 ¡Solicitud confirmada! Pasa a la ventanilla en las fechas indicadas.`);
      this.carrito = [];
    }
  }
}