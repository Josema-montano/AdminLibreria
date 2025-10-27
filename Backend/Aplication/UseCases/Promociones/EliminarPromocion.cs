using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Promociones
{
    public class EliminarPromocion
    {
private readonly IPromocionRepositorio _promocionRepositorio;

        public EliminarPromocion(IPromocionRepositorio promocionRepositorio)
     {
    _promocionRepositorio = promocionRepositorio;
        }

        public async Task EjecutarAsync(int promocionId)
        {
  if (promocionId == 0)
    throw new ArgumentException("El ID de la promoci�n es obligatorio.");

var promocion = await _promocionRepositorio.ObtenerPorIdAsync(promocionId);
            if (promocion is null)
      throw new ArgumentException("La promoci�n no existe.");

     await _promocionRepositorio.EliminarAsync(promocionId);
  }
    }
}
