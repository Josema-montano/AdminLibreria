using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases.Clientes
{
    public class CrearCliente
    {
        private readonly IClienteRepositorio _clienteRepositorio;

        public CrearCliente(IClienteRepositorio clienteRepositorio)
        {
            _clienteRepositorio = clienteRepositorio;
        }

        public async Task EjecutarAsync(Cliente cliente)
        {
            // Validaciones de negocio
            ValidarCliente(cliente);

            // No es necesario asignar ID manualmente, Entity Framework lo genera autom�ticamente

            // Crear cliente
            await _clienteRepositorio.CrearAsync(cliente);
        }

        private void ValidarCliente(Cliente cliente)
        {
            if (cliente is null)
                throw new ArgumentNullException(nameof(cliente));

            if (string.IsNullOrWhiteSpace(cliente.Nombres))
                throw new ArgumentException("El nombre es obligatorio.");

            if (string.IsNullOrWhiteSpace(cliente.Apellidos))
                throw new ArgumentException("El apellido es obligatorio.");

            if (string.IsNullOrWhiteSpace(cliente.Documento))
                throw new ArgumentException("El documento es obligatorio.");
        }
    }
}
