export interface DetalleVentaDTO {
  ventaId: number;
  productoId: number;
  cantidad: number;
  subtotal: number;
  producto?: ProductoDTO;
}

export interface VentaDTO {
  id?: number;
  fecha: string;
  clienteId?: number;
  total: number;
  cancelada?: boolean;
  detalles?: DetalleVentaDTO[];
  cliente?: ClienteDTO;
}

export interface ProductoDTO {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  proveedorId?: number;
  imagenUrl?: string;
  precioPromocional?: number;
}

export interface ClienteDTO {
  id?: number;
  nombres: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export interface ProveedorDTO {
  id?: number;
  nombre: string;
  ruc?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export interface PromocionDTO {
  id?: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  productos?: ProductoDTO[];
}

export interface DevolucionDTO {
  id?: number;
  productoId: number;
  clienteId: number;
  fecha: string;
  cantidad: number;
  motivo: string;
}
