using System;

namespace Domain.Entities
{
 public class PromocionProducto
 {
 public int PromocionId { get; set; }
 public Promocion? Promocion { get; set; }
 public int ProductoId { get; set; }
 public Producto? Producto { get; set; }
 public decimal DescuentoPorcentaje { get; set; } //0-100
 }
}
