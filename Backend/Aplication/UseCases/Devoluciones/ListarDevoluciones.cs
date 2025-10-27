using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplication.UseCases.Devoluciones
{
    public class ListarDevoluciones
    {
private readonly IDevolucionRepositorio _devolucionRepositorio;

   public ListarDevoluciones(IDevolucionRepositorio devolucionRepositorio)
        {
     _devolucionRepositorio = devolucionRepositorio;
 }

        public async Task<IEnumerable<Devolucion>> EjecutarAsync()
   {
   return await _devolucionRepositorio.ListarAsync();
  }
    }
}
