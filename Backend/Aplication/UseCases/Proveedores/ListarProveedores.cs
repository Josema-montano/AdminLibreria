using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplication.UseCases.Proveedores
{
    public class ListarProveedores
{
  private readonly IProveedorRepositorio _proveedorRepositorio;

        public ListarProveedores(IProveedorRepositorio proveedorRepositorio)
 {
   _proveedorRepositorio = proveedorRepositorio;
        }

  public async Task<IEnumerable<Proveedor>> EjecutarAsync()
     {
 return await _proveedorRepositorio.ListarAsync();
        }
    }
}
