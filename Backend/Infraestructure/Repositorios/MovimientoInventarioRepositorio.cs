using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infraestructure.Repositorios
{
 public class MovimientoInventarioRepositorio : IMovimientoInventarioRepositorio
 {
 private readonly AppDbContext _context;
 public MovimientoInventarioRepositorio(AppDbContext context) { _context = context; }
 public async Task<IEnumerable<MovimientoInventario>> ListarPorProductoAsync(int productoId)
 => await _context.Movimientos.Where(m=>m.ProductoId==productoId).AsNoTracking().ToListAsync();

 public async Task<IEnumerable<MovimientoInventario>> ListarTodosAsync()
 => await _context.Movimientos.AsNoTracking().ToListAsync();

 public async Task RegistrarAsync(MovimientoInventario movimiento)
 {
 _context.Movimientos.Add(movimiento);
 await _context.SaveChangesAsync();
 }
 }
}
