using Aplication.DTOs;
using Aplication.UseCases.Proveedores;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
  [ApiController]
    public class ProveedoresController : ControllerBase
  {
        private readonly CrearProveedor _crearProveedor;
private readonly ActualizarProveedor _actualizarProveedor;
        private readonly EliminarProveedor _eliminarProveedor;
        private readonly ObtenerProveedorPorId _obtenerProveedorPorId;
      private readonly ObtenerProveedorConProductos _obtenerProveedorConProductos;
        private readonly ListarProveedores _listarProveedores;
        private readonly IMapper _mapper;

   public ProveedoresController(
     CrearProveedor crearProveedor,
  ActualizarProveedor actualizarProveedor,
   EliminarProveedor eliminarProveedor,
     ObtenerProveedorPorId obtenerProveedorPorId,
   ObtenerProveedorConProductos obtenerProveedorConProductos,
  ListarProveedores listarProveedores,
    IMapper mapper)
 {
      _crearProveedor = crearProveedor;
 _actualizarProveedor = actualizarProveedor;
      _eliminarProveedor = eliminarProveedor;
            _obtenerProveedorPorId = obtenerProveedorPorId;
            _obtenerProveedorConProductos = obtenerProveedorConProductos;
     _listarProveedores = listarProveedores;
 _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var proveedores = await _listarProveedores.EjecutarAsync();

      if (!proveedores.Any())
          return NotFound(new { mensaje = "No hay proveedores registrados." });

 return Ok(proveedores);
        }

[HttpGet("{id}")]
   public async Task<IActionResult> GetById(int id)
        {
    var proveedor = await _obtenerProveedorPorId.EjecutarAsync(id);
  if (proveedor == null)
  return NotFound(new { mensaje = "Proveedor no encontrado." });

         return Ok(proveedor);
        }

        /// <summary>
        /// Obtiene un proveedor con todos sus productos asociados
        /// </summary>
        [HttpGet("{id}/detalles")]
        public async Task<IActionResult> GetByIdConProductos(int id)
        {
        var proveedor = await _obtenerProveedorConProductos.EjecutarAsync(id);
       if (proveedor == null)
                return NotFound(new { mensaje = "Proveedor no encontrado." });

      return Ok(proveedor);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProveedorDTO proveedorDTO)
        {
            if (!ModelState.IsValid)
          return BadRequest(ModelState);

            var proveedor = _mapper.Map<Proveedor>(proveedorDTO);
      await _crearProveedor.EjecutarAsync(proveedor);

        var proveedorCreado = await _obtenerProveedorPorId.EjecutarAsync(proveedor.Id);
            return CreatedAtAction(nameof(GetById), new { id = proveedorCreado.Id }, proveedorCreado);
}

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProveedorDTO proveedorDTO)
        {
            if (id != proveedorDTO.Id)
                return BadRequest(new { mensaje = "El ID de la URL no coincide con el ID del proveedor." });

      if (!ModelState.IsValid)
      return BadRequest(ModelState);

var proveedor = _mapper.Map<Proveedor>(proveedorDTO);
       await _actualizarProveedor.EjecutarAsync(proveedor);

    var proveedorActualizado = await _obtenerProveedorPorId.EjecutarAsync(id);
            return Ok(proveedorActualizado);
        }

   [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _eliminarProveedor.EjecutarAsync(id);
            return NoContent();
    }
    }
}
