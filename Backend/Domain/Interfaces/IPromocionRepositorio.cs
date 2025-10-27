using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
 public interface IPromocionRepositorio
 {
 Task<IEnumerable<Promocion>> ListarAsync();
  Task<Promocion?> ObtenerPorIdAsync(int id);
  Task CrearAsync(Promocion promo);
   Task ActualizarAsync(Promocion promo);
        Task EliminarAsync(int id);
 Task<IEnumerable<Promocion>> ListarActivasAsync(DateTime fecha);
 }
}
