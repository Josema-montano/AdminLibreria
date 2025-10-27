using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Devoluciones
{
 public class RegistrarDevolucion
 {
 private readonly IDevolucionRepositorio _devolRepo;
 private readonly IProductoRepositorio _productoRepo;
 private readonly IMovimientoInventarioRepositorio _movRepo;
 public RegistrarDevolucion(IDevolucionRepositorio devolRepo, IProductoRepositorio productoRepo, IMovimientoInventarioRepositorio movRepo)
 { _devolRepo=devolRepo; _productoRepo=productoRepo; _movRepo=movRepo; }
   public async Task<int> EjecutarAsync(int productoId, int cantidad, string motivo, int? clienteId=null)
        {
  if (cantidad<=0) throw new ArgumentException("Cantidad inv�lida");
   var prod = await _productoRepo.ObtenerPorIdAsync(productoId) ?? throw new ArgumentException("Producto no encontrado");
     var devol = new Devolucion{ ProductoId=productoId, ClienteId=clienteId, Fecha=DateTime.UtcNow, Cantidad=cantidad, Motivo=motivo };
     await _devolRepo.RegistrarAsync(devol);
        var mov = new MovimientoInventario{ ProductoId=productoId, Fecha=DateTime.UtcNow, Cantidad=cantidad, Tipo=TipoMovimientoInventario.Ingreso, Motivo=$"Devoluci�n: {motivo}", ReferenciaId=devol.Id };
   prod.Stock += cantidad;
  await _productoRepo.ActualizarAsync(prod);
  await _movRepo.RegistrarAsync(mov);
  return devol.Id;
 }
 }
}
