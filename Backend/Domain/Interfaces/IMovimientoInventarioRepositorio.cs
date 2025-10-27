using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
 public interface IMovimientoInventarioRepositorio
 {
   Task<IEnumerable<MovimientoInventario>> ListarPorProductoAsync(int productoId);
   Task<IEnumerable<MovimientoInventario>> ListarTodosAsync(); // Nuevo m�todo
        Task RegistrarAsync(MovimientoInventario movimiento);
 }
}
