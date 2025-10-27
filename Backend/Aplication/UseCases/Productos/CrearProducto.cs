using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Productos
{
 public class CrearProducto
 {
 private readonly IProductoRepositorio _repo;
 public CrearProducto(IProductoRepositorio repo){ _repo=repo; }
 public async Task EjecutarAsync(Producto producto)
 {
 if(producto==null) throw new ArgumentNullException(nameof(producto));
 if(string.IsNullOrWhiteSpace(producto.Codigo)) throw new ArgumentException("C�digo requerido");
 if(string.IsNullOrWhiteSpace(producto.Nombre)) throw new ArgumentException("Nombre requerido");
 var existe = await _repo.ObtenerPorCodigoAsync(producto.Codigo);
 if(existe!=null) throw new InvalidOperationException("C�digo ya existe");
        // No es necesario asignar ID manualmente, Entity Framework lo genera autom�ticamente
  await _repo.CrearAsync(producto);
 }
 }
}
