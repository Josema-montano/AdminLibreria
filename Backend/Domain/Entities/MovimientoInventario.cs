using System;

namespace Domain.Entities
{
 public class MovimientoInventario
 {
 public int Id { get; set; }
 public int ProductoId { get; set; }
 public Producto? Producto { get; set; }
 public DateTime Fecha { get; set; }
 public int Cantidad { get; set; }
 public TipoMovimientoInventario Tipo { get; set; }
 public string Motivo { get; set; } = string.Empty;
 public int? ReferenciaId { get; set; } // venta/compra/devoluci�n
 }
}
