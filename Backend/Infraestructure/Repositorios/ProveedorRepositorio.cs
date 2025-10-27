using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infraestructure.Repositorios
{
 public class ProveedorRepositorio : IProveedorRepositorio
 {
 private readonly AppDbContext _context;
 public ProveedorRepositorio(AppDbContext context) { _context = context; }
 public async Task<IEnumerable<Proveedor>> ListarAsync() => await _context.Proveedores.AsNoTracking().ToListAsync();
  public async Task<Proveedor?> ObtenerPorIdAsync(int id) => await _context.Proveedores.FindAsync(id);
 
        // Nuevo m�todo para obtener con productos
 public async Task<Proveedor?> ObtenerConProductosAsync(int id) 
         => await _context.Proveedores.Include(p => p.Productos).AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        
 public async Task CrearAsync(Proveedor proveedor) { _context.Proveedores.Add(proveedor); await _context.SaveChangesAsync(); }
 public async Task ActualizarAsync(Proveedor proveedor)
{
 var existente = await _context.Proveedores.FindAsync(proveedor.Id);
 if (existente == null) throw new KeyNotFoundException("Proveedor no encontrado");
 existente.Nombre = proveedor.Nombre;
 existente.Ruc = proveedor.Ruc;
 existente.Telefono = proveedor.Telefono;
 existente.Email = proveedor.Email;
 existente.Direccion = proveedor.Direccion;
 await _context.SaveChangesAsync();
}
 public async Task EliminarAsync(int id)
  {
        var prov = await _context.Proveedores.FindAsync(id);
       if (prov != null) { _context.Proveedores.Remove(prov); await _context.SaveChangesAsync(); }
  }
 }
}
