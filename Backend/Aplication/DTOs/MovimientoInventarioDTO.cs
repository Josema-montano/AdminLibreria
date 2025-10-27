using System;

namespace Aplication.DTOs
{
 public class MovimientoInventarioDTO
 {
 public int Id { get; set; }
 public int ProductoId { get; set; }
 public DateTime Fecha { get; set; }
 public int Cantidad { get; set; }
 public string Tipo { get; set; } = string.Empty; // Ingreso/Egreso
 public string Motivo { get; set; } = string.Empty;
 }
}
