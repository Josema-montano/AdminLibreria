using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Proveedores
{
    public class ObtenerProveedorConProductos
    {
        private readonly IProveedorRepositorio _proveedorRepositorio;

        public ObtenerProveedorConProductos(IProveedorRepositorio proveedorRepositorio)
        {
  _proveedorRepositorio = proveedorRepositorio;
        }

   public async Task<Proveedor?> EjecutarAsync(int proveedorId)
        {
            if (proveedorId == 0)
 throw new ArgumentException("El ID del proveedor es obligatorio.");

   return await _proveedorRepositorio.ObtenerConProductosAsync(proveedorId);
        }
    }
}
