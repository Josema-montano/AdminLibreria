using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infraestructure.Repositorios
{
 public class ClienteRepositorio : IClienteRepositorio
 {
 private readonly AppDbContext _context;
 public ClienteRepositorio(AppDbContext context) { _context = context; }
 public async Task<IEnumerable<Cliente>> ListarAsync() => await _context.Clientes.AsNoTracking().ToListAsync();
 public async Task<Cliente?> ObtenerPorIdAsync(int id) => await _context.Clientes.FindAsync(id);
 public async Task CrearAsync(Cliente cliente) { _context.Clientes.Add(cliente); await _context.SaveChangesAsync(); }
 public async Task ActualizarAsync(Cliente cliente)
 {
 var existente = await _context.Clientes.FindAsync(cliente.Id);
 if (existente == null) throw new KeyNotFoundException("Cliente no encontrado");

 existente.Nombres = cliente.Nombres;
 existente.Apellidos = cliente.Apellidos;
 existente.Documento = cliente.Documento;
 existente.Telefono = cliente.Telefono;
 existente.Email = cliente.Email;
 existente.Direccion = cliente.Direccion;

 await _context.SaveChangesAsync();
 }
 public async Task EliminarAsync(int id)
 {
 var cli = await _context.Clientes.FindAsync(id);
 if (cli != null) { _context.Clientes.Remove(cli); await _context.SaveChangesAsync(); }
 }
 }
}
