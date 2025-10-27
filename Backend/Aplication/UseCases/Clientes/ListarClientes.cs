using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplication.UseCases.Clientes
{
  public class ListarClientes
    {
  private readonly IClienteRepositorio _clienteRepositorio;

        public ListarClientes(IClienteRepositorio clienteRepositorio)
        {
       _clienteRepositorio = clienteRepositorio;
        }

  public async Task<IEnumerable<Cliente>> EjecutarAsync()
        {
            return await _clienteRepositorio.ListarAsync();
  }
    }
}
