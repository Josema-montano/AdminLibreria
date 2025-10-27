using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplication.UseCases.Inventario
{
    public class ListarMovimientosPorProducto
    {
 private readonly IMovimientoInventarioRepositorio _movimientoRepositorio;

  public ListarMovimientosPorProducto(IMovimientoInventarioRepositorio movimientoRepositorio)
  {
    _movimientoRepositorio = movimientoRepositorio;
 }

        public async Task<IEnumerable<MovimientoInventario>> EjecutarAsync(int productoId)
   {
if (productoId == 0)
   throw new ArgumentException("El ID del producto es obligatorio.");

 return await _movimientoRepositorio.ListarPorProductoAsync(productoId);
 }
    }
}
