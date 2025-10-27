export interface VentaDTO {
  id?: number;
  clienteId?: number;
  cliente?: ClienteDTO;
  fecha: string;
  total: number;
  detalles?: DetalleVentaDTO[];
  cancelada?: boolean;
}
// Interfaces para ventas
export interface DetalleVentaDTO {
  productoId: number;
  cantidad: number;
  subtotal: number;
  producto?: ProductoDTO;
  ventaId?: number;
  precioUnitario: number;
}
// Interfaces para Clientes
export interface ClienteDTO {
  id?: number;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
}

// Interfaces para Proveedores
export interface ProveedorDTO {
  id?: number;
  nombre: string;
  ruc: string;
  telefono: string;
  email: string;
  direccion: string;
}

// Interfaces para Productos
export interface ProductoDTO {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  precioPromocional?: number;
  stock: number;
  stockMinimo: number;
  proveedorId?: number;
  proveedor?: ProveedorDTO;
  imagenUrl?: string;
}

// Interfaces para Promociones
export interface PromocionDTO {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}

export interface PromocionProductoDTO {
  promocionId: number;
  productoId: number;
  descuentoPorcentaje: number;
  producto?: ProductoDTO;
  promocion?: PromocionDTO;
}

// Interfaces para Devoluciones
export interface DevolucionDTO {
  id?: number;
  productoId: number;
  clienteId?: number;
  fecha: string;
  cantidad: number;
  motivo: string;
  producto?: ProductoDTO;
  cliente?: ClienteDTO;
}

// Interfaces para Inventario
export interface MovimientoDTO {
  id?: number;
  productoId: number;
  fecha: string;
  cantidad: number;
  tipo: string; // 'Ingreso' | 'Egreso'
  motivo: string;
  referenciaId?: number;
  producto?: ProductoDTO;
}

export enum TipoMovimiento {
  Entrada = 0,
  Salida = 1,
  Ajuste = 2,
}

// Interface para alertas de stock
export interface AlertaStockDTO {
  productoId: number;
  nombreProducto: string;
  stockActual: number;
  stockMinimo: number;
}
