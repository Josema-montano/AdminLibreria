using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
 public interface IClienteRepositorio
 {
 Task<IEnumerable<Cliente>> ListarAsync();
 Task<Cliente?> ObtenerPorIdAsync(int id);
 Task CrearAsync(Cliente cliente);
 Task ActualizarAsync(Cliente cliente);
 Task EliminarAsync(int id);
 }
}
