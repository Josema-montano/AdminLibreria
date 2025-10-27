using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Productos
{
    public class ActualizarProducto
    {
        private readonly IProductoRepositorio _productoRepositorio;

        public ActualizarProducto(IProductoRepositorio productoRepositorio)
        {
            _productoRepositorio = productoRepositorio;
        }

        public async Task EjecutarAsync(Producto producto)
        {
            // Validaciones de negocio
            ValidarProducto(producto);

            var productoExistente = await _productoRepositorio.ObtenerPorIdAsync(producto.Id);
            if (productoExistente is null)
                throw new InvalidOperationException("El producto no existe.");

            // Actualizar solo las propiedades necesarias
            productoExistente.Codigo = producto.Codigo;
            productoExistente.Nombre = producto.Nombre;
            productoExistente.Descripcion = producto.Descripcion;
            productoExistente.PrecioCompra = producto.PrecioCompra;
            productoExistente.PrecioVenta = producto.PrecioVenta;
            productoExistente.Stock = producto.Stock;
            productoExistente.StockMinimo = producto.StockMinimo;
            productoExistente.ImagenUrl = producto.ImagenUrl;
            productoExistente.ProveedorId = producto.ProveedorId;

            await _productoRepositorio.ActualizarAsync(productoExistente);
        }

        private void ValidarProducto(Producto producto)
        {
            if (producto is null)
                throw new ArgumentNullException(nameof(producto));

            if (producto.Id == 0)
                throw new ArgumentException("El ID del producto es obligatorio.");

            if (string.IsNullOrWhiteSpace(producto.Codigo))
                throw new ArgumentException("El c�digo es obligatorio.");

            if (string.IsNullOrWhiteSpace(producto.Nombre))
                throw new ArgumentException("El nombre es obligatorio.");

            if (producto.PrecioCompra < 0)
                throw new ArgumentException("El precio de compra no puede ser negativo.");

            if (producto.PrecioVenta < 0)
                throw new ArgumentException("El precio de venta no puede ser negativo.");

            if (producto.Stock < 0)
                throw new ArgumentException("El stock no puede ser negativo.");
        }
    }
}
