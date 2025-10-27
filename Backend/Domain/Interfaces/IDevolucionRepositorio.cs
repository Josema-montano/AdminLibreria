using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
 public interface IDevolucionRepositorio
 {
 Task<IEnumerable<Devolucion>> ListarAsync();
 Task<Devolucion?> ObtenerPorIdAsync(int id);
 Task RegistrarAsync(Devolucion devolucion);
 }
}
