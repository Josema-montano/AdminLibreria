using System;

namespace Aplication.DTOs
{
 public class ClienteDTO
 {
 public int Id { get; set; }
 public string Nombres { get; set; } = string.Empty;
 public string Apellidos { get; set; } = string.Empty;
 public string Documento { get; set; } = string.Empty;
 public string Telefono { get; set; } = string.Empty;
 public string Email { get; set; } = string.Empty;
 public string Direccion { get; set; } = string.Empty;
 }
}
