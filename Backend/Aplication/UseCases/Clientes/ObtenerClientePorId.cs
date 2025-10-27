using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Clientes
{
    public class ObtenerClientePorId
    {
  private readonly IClienteRepositorio _clienteRepositorio;

        public ObtenerClientePorId(IClienteRepositorio clienteRepositorio)
        {
      _clienteRepositorio = clienteRepositorio;
 }

        public async Task<Cliente?> EjecutarAsync(int clienteId)
   {
 if (clienteId == 0)
            throw new ArgumentException("El ID del cliente es obligatorio.");

            return await _clienteRepositorio.ObtenerPorIdAsync(clienteId);
        }
    }
}
