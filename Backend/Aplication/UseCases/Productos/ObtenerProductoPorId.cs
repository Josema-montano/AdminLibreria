using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Productos
{
    public class ObtenerProductoPorId
    {
        private readonly IProductoRepositorio _productoRepositorio;

        public ObtenerProductoPorId(IProductoRepositorio productoRepositorio)
        {
            _productoRepositorio = productoRepositorio;
        }

        public async Task<Producto?> EjecutarAsync(int productoId)
        {
            if (productoId == 0)
                throw new ArgumentException("El ID del producto es obligatorio.");

            return await _productoRepositorio.ObtenerPorIdAsync(productoId);
        }
    }
}
