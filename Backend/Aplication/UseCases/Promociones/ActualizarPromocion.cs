using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aplication.UseCases.Promociones
{
    public class ActualizarPromocion
    {
        private readonly IPromocionRepositorio _promocionRepositorio;
        private readonly IProductoRepositorio _productoRepositorio;

        public ActualizarPromocion(IPromocionRepositorio promocionRepositorio, IProductoRepositorio productoRepositorio)
        {
            _promocionRepositorio = promocionRepositorio;
            _productoRepositorio = productoRepositorio;
        }

        public async Task EjecutarAsync(int promocionId, Promocion datosPromocion, IEnumerable<(int ProductoId, decimal Descuento)>? productos = null)
        {
            // Validar que la promoci�n exista
            var promocionExistente = await _promocionRepositorio.ObtenerPorIdAsync(promocionId);
            if (promocionExistente is null)
                throw new ArgumentException("La promoci�n no existe.");

            // Validaciones de negocio
            if (string.IsNullOrWhiteSpace(datosPromocion.Nombre))
                throw new ArgumentException("El nombre de la promoci�n es obligatorio.");

            if (datosPromocion.FechaInicio >= datosPromocion.FechaFin)
                throw new ArgumentException("La fecha de inicio debe ser anterior a la fecha de fin.");

            // Actualizar datos b�sicos
            promocionExistente.Nombre = datosPromocion.Nombre;
            promocionExistente.Descripcion = datosPromocion.Descripcion;
            promocionExistente.FechaInicio = datosPromocion.FechaInicio;
            promocionExistente.FechaFin = datosPromocion.FechaFin;
            promocionExistente.Activa = datosPromocion.Activa;

            // Si se proporcionaron productos, actualizar la lista
            if (productos != null)
            {
                promocionExistente.Productos.Clear();

                foreach (var item in productos)
                {
                    var producto = await _productoRepositorio.ObtenerPorIdAsync(item.ProductoId);
                    if (producto is null)
                        throw new ArgumentException($"El producto con ID {item.ProductoId} no existe.");

                    if (item.Descuento <= 0 || item.Descuento > 100)
                        throw new ArgumentException("El descuento debe estar entre 0 y 100.");

                    promocionExistente.Productos.Add(new PromocionProducto
                    {
                        PromocionId = promocionId,
                        ProductoId = item.ProductoId,
                        DescuentoPorcentaje = item.Descuento
                    });
                }
            }

            await _promocionRepositorio.ActualizarAsync(promocionExistente);
        }

        public async Task AgregarProductosAsync(int promocionId, IEnumerable<(int ProductoId, decimal DescuentoPorcentaje)> productos)
        {
            var promocion = await _promocionRepositorio.ObtenerPorIdAsync(promocionId);
            if (promocion == null) throw new KeyNotFoundException("Promoci�n no encontrada");
            // Elimina todos los productos actuales de la promoci�n
            promocion.Productos.Clear();
            // Asigna los nuevos productos
            foreach (var prod in productos)
            {
                promocion.Productos.Add(new PromocionProducto
                {
                    PromocionId = promocionId,
                    ProductoId = prod.ProductoId,
                    DescuentoPorcentaje = prod.DescuentoPorcentaje
                });
            }
            await _promocionRepositorio.ActualizarAsync(promocion);
        }
    }
}
