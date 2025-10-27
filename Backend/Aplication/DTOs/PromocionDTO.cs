using System;
using System.Collections.Generic;

namespace Aplication.DTOs
{
 public class PromocionDTO
 {
 public int Id { get; set; }
 public string Nombre { get; set; } = string.Empty;
 public string Descripcion { get; set; } = string.Empty;
 public DateTime FechaInicio { get; set; }
 public DateTime FechaFin { get; set; }
 public bool Activa { get; set; }
 public List<PromocionProductoDTO> Productos { get; set; } = new();
 }

 public class PromocionProductoDTO
 {
 public int ProductoId { get; set; }
 public ProductoDTO? Producto { get; set; }
 public decimal DescuentoPorcentaje { get; set; }
 }
}
