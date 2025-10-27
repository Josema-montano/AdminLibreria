using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplication.UseCases.Inventario
{
 public class ListarTodosMovimientos
 {
 private readonly IMovimientoInventarioRepositorio _repo;
 public ListarTodosMovimientos(IMovimientoInventarioRepositorio repo)
 {
 _repo = repo;
 }

 public async Task<IEnumerable<MovimientoInventario>> EjecutarAsync()
 {
 return await _repo.ListarTodosAsync();
 }
 }
}
