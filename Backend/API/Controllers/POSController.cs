using Aplication.DTOs;
using Aplication.UseCases.POS;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
 [Route("api/pos")]
 [ApiController]
 public class POSController : ControllerBase
 {
 private readonly RegistrarVenta _registrarVenta;
 private readonly ListarVentas _listarVentas;
 private readonly CancelarVenta _cancelarVenta;
 public POSController(RegistrarVenta registrarVenta, ListarVentas listarVentas, CancelarVenta cancelarVenta)
 {
 _registrarVenta = registrarVenta;
 _listarVentas = listarVentas;
 _cancelarVenta = cancelarVenta;
 }

 [HttpPost("venta")]
 public async Task<IActionResult> RegistrarVenta([FromBody] VentaDTO ventaDTO)
 {
 if (!ModelState.IsValid)
 return BadRequest(ModelState);
 try
 {
 var (id, recibo) = await _registrarVenta.EjecutarAsync(ventaDTO);
 return Ok(new { mensaje = "Venta registrada", ventaId = id, recibo });
 }
 catch (Exception ex)
 {
 return BadRequest(new { mensaje = ex.Message });
 }
 }

 [HttpGet("ventas")]
 public async Task<IActionResult> ListarVentas()
 {
 var ventas = await _listarVentas.EjecutarAsync();
 return Ok(ventas);
 }

 [HttpPost("cancelar/{id}")]
 public async Task<IActionResult> CancelarVenta(int id, [FromBody] CancelarVentaRequest request)
 {
 try
 {
 await _cancelarVenta.EjecutarAsync(id, request.Motivo, request.MotivoDevolucion, request.ClienteId);
 return Ok(new { mensaje = "Venta cancelada correctamente." });
 }
 catch (Exception ex)
 {
 return BadRequest(new { mensaje = ex.Message });
 }
 }

 [HttpGet("recibo/{id}")]
 public async Task<IActionResult> ObtenerRecibo(int id)
 {
 var ventas = await _listarVentas.EjecutarAsync();
 var recibo = ventas.FirstOrDefault(v => v.Id == id)?.Recibo;
 if (recibo == null)
 return NotFound(new { mensaje = "Recibo no encontrado." });
 return Ok(new { recibo });
 }

 public class CancelarVentaRequest
 {
 public string Motivo { get; set; } = string.Empty;
 public string? MotivoDevolucion { get; set; }
 public int? ClienteId { get; set; }
 }
 }
}
