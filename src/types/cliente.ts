export interface Cliente {
  id: number;        // For internal use
  idCliente: number; // From API
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaRegistro: string;
}