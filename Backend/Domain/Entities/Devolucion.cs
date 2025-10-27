using System;

namespace Domain.Entities
{
    public class Devolucion
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public Producto? Producto { get; set; }
        public int? ClienteId { get; set; }
        public Cliente? Cliente { get; set; }
        public DateTime Fecha { get; set; }
        public int Cantidad { get; set; }
        public string Motivo { get; set; } = string.Empty;
    }
}
