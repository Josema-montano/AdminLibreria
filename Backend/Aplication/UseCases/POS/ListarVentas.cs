using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplication.UseCases.POS
{
 public class ListarVentas
 {
 private readonly IVentaRepositorio _repo;
 public ListarVentas(IVentaRepositorio repo) { _repo = repo; }
 public async Task<IEnumerable<Venta>> EjecutarAsync()
 {
 return await _repo.ListarAsync();
 }
 }
}
