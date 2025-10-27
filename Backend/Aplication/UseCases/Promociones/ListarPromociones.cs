using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplication.UseCases.Promociones
{
    public class ListarPromociones
 {
        private readonly IPromocionRepositorio _promocionRepositorio;

        public ListarPromociones(IPromocionRepositorio promocionRepositorio)
     {
_promocionRepositorio = promocionRepositorio;
      }

        public async Task<IEnumerable<Promocion>> EjecutarAsync(bool soloActivas = false)
    {
  if (soloActivas)
      return await _promocionRepositorio.ListarActivasAsync(DateTime.UtcNow);

          return await _promocionRepositorio.ListarAsync();
  }
    }
}
