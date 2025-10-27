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
 public class PromocionRepositorio : IPromocionRepositorio
 {
 private readonly AppDbContext _context;
 public PromocionRepositorio(AppDbContext context) { _context = context; }
 public async Task<IEnumerable<Promocion>> ListarAsync() => await _context.Promociones.Include(p => p.Productos).ThenInclude(pp => pp.Producto).AsNoTracking().ToListAsync();
        public async Task<Promocion?> ObtenerPorIdAsync(int id) => await _context.Promociones.Include(p=>p.Productos).ThenInclude(pp=>pp.Producto).FirstOrDefaultAsync(x=>x.Id==id);
 public async Task CrearAsync(Promocion promo) { _context.Promociones.Add(promo); await _context.SaveChangesAsync(); }
 public async Task ActualizarAsync(Promocion promo)
{
 var existente = await _context.Promociones.Include(p => p.Productos).FirstOrDefaultAsync(p => p.Id == promo.Id);
 if (existente == null) throw new KeyNotFoundException("Promoci�n no encontrada");
 existente.Nombre = promo.Nombre;
 existente.Descripcion = promo.Descripcion;
 existente.FechaInicio = promo.FechaInicio;
 existente.FechaFin = promo.FechaFin;
 existente.Activa = promo.Activa;
 // Actualizar productos asociados si es necesario
 await _context.SaveChangesAsync();
}
        public async Task EliminarAsync(int id)
        {
    var promo = await _context.Promociones.Include(p=>p.Productos).FirstOrDefaultAsync(p=>p.Id==id);
      if (promo != null) { _context.PromocionProductos.RemoveRange(promo.Productos); _context.Promociones.Remove(promo); await _context.SaveChangesAsync(); }
        }
 public async Task<IEnumerable<Promocion>> ListarActivasAsync(DateTime fecha)
 => await _context.Promociones.Where(p => p.Activa && p.FechaInicio <= fecha && p.FechaFin >= fecha).Include(p => p.Productos).ThenInclude(pp => pp.Producto).AsNoTracking().ToListAsync();
 }
}
