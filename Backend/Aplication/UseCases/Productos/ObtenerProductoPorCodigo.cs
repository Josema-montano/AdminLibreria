using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Productos
{
    public class ObtenerProductoPorCodigo
    {
        private readonly IProductoRepositorio _productoRepositorio;

      public ObtenerProductoPorCodigo(IProductoRepositorio productoRepositorio)
        {
  _productoRepositorio = productoRepositorio;
        }

        public async Task<Producto?> EjecutarAsync(string codigo)
   {
if (string.IsNullOrWhiteSpace(codigo))
    throw new ArgumentException("El c�digo del producto es obligatorio.");

 return await _productoRepositorio.ObtenerPorCodigoAsync(codigo);
  }
    }
}
