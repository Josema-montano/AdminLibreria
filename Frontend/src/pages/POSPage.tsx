import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { VentaDTO, ProductoDTO, ClienteDTO, DetalleVentaDTO } from "../types/index";
  // import { CLIENTES_API_URL } from "../config/api"; // Eliminado, no se usa
  import { CreditCard, ShoppingCart, Users, BarChart } from "lucide-react";

  const POSPage: React.FC = () => {
  // Mostrar recibo desde historial
  const mostrarReciboVenta = async (ventaId: number) => {
    try {
      const reciboResp = await axios.get(`/api/pos/recibo/${ventaId}`);
      setReciboTexto(reciboResp.data.recibo);
      setReciboModalOpen(true);
    } catch {
      setReciboTexto('No se pudo obtener el recibo.');
      setReciboModalOpen(true);
    }
  };
    const [cancelarModalOpen, setCancelarModalOpen] = useState<boolean>(false);
    const [ventaCancelar, setVentaCancelar] = useState<VentaDTO | null>(null);
    const [motivoCancelacion, setMotivoCancelacion] = useState<string>("");
    const [motivoDevolucion, setMotivoDevolucion] = useState<string>("");
    const [errorCancelar, setErrorCancelar] = useState<string>("");
    // Cancelar venta
    const abrirCancelarVenta = (venta: VentaDTO) => {
      setVentaCancelar(venta);
      setMotivoCancelacion("");
      setMotivoDevolucion("");
      setErrorCancelar("");
      setCancelarModalOpen(true);
    };

    const cancelarVenta = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorCancelar("");
      if (!motivoCancelacion.trim()) {
        setErrorCancelar("Debes ingresar un motivo de cancelación.");
        return;
      }
      if (motivoCancelacion.trim().toLowerCase() === "devolucion" && !motivoDevolucion.trim()) {
        setErrorCancelar("Debes ingresar el motivo de devolución.");
        return;
      }
      try {
        await axios.post(`/api/pos/cancelar/${ventaCancelar?.id}`, {
          motivo: motivoCancelacion,
          motivoDevolucion: motivoCancelacion.trim().toLowerCase() === "devolucion" ? motivoDevolucion : undefined,
          clienteId: ventaCancelar?.clienteId
        });
        setCancelarModalOpen(false);
        setVentaCancelar(null);
        listarVentas();
      } catch (err: any) {
        setErrorCancelar(err.response?.data?.mensaje || "Error al cancelar la venta");
      }
    };
    const [ventas, setVentas] = useState<VentaDTO[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    // POS modal states
    const [productos, setProductos] = useState<ProductoDTO[]>([]);
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [busquedaProducto, setBusquedaProducto] = useState("");
    const [carrito, setCarrito] = useState<DetalleVentaDTO[]>([]);
    const [clienteId, setClienteId] = useState<number | undefined>(undefined);
    // Eliminado campo fecha, el backend la asigna automáticamente
    const [tipoPago, setTipoPago] = useState<string>("Efectivo");
    const [descuento, setDescuento] = useState<number>(0);
    const [notas, setNotas] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [procesando, setProcesando] = useState<boolean>(false);
  const [reciboTexto, setReciboTexto] = useState<string>("");
  const [reciboModalOpen, setReciboModalOpen] = useState<boolean>(false);
    const [mostrarCanceladas, setMostrarCanceladas] = useState<boolean>(false);
    const [filtroFecha, setFiltroFecha] = useState<'hoy' | 'semana' | 'mes'>('hoy');

    useEffect(() => {
      listarVentas();
      listarProductos();
      listarClientes();
    }, []);

    const listarVentas = async () => {
      try {
        const response = await axios.get<VentaDTO[]>("/api/pos/ventas");
        setVentas(response.data || []);
      } catch (error: any) {
        setVentas([]);
      } finally {
        // loading eliminado
      }
    };

    const listarProductos = async () => {
      try {
        const response = await axios.get<ProductoDTO[]>("/api/Productos");
        setProductos(response.data || []);
      } catch {
        setProductos([]);
      }
    };

    const listarClientes = async () => {
      try {
        const response = await axios.get<ClienteDTO[]>("/api/Clientes");
        setClientes(response.data || []);
      } catch {
        setClientes([]);
      }
    };

    // Filtrar productos por búsqueda
    const productosFiltrados = productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busquedaProducto.toLowerCase())
    );

    // Agregar producto al carrito
    const agregarProductoCarrito = (producto: ProductoDTO) => {
      if (producto.stock === 0) return;
      const yaEnCarrito = carrito.find((d) => d.productoId === producto.id);
      if (yaEnCarrito) {
        setCarrito(
            carrito.map((d) =>
              d.productoId === producto.id
                ? { ...d, cantidad: d.cantidad + 1, subtotal: (d.cantidad + 1) * obtenerPrecioProducto(d.producto ?? producto) }
                : d
            )
        );
      } else {
        setCarrito([
          ...carrito,
          {
            productoId: producto.id!,
            cantidad: 1,
              precioUnitario: obtenerPrecioProducto(producto),
              subtotal: obtenerPrecioProducto(producto),
            producto,
            ventaId: 0,
          },
        ]);
      }
    };

    // Cambiar cantidad en carrito
    const cambiarCantidadCarrito = (productoId: number, cantidad: number) => {
      setCarrito(
        carrito.map((d) =>
          d.productoId === productoId
            ? { ...d, cantidad, subtotal: cantidad * d.precioUnitario }
            : d
        )
      );
    };

    // Quitar producto del carrito
    const quitarProductoCarrito = (productoId: number) => {
      setCarrito(carrito.filter((d) => d.productoId !== productoId));
    };

    // Calcular totales
    const totalVenta = carrito.reduce((acc, d) => acc + d.subtotal, 0);
    const totalFinal = Math.max(totalVenta - descuento, 0);

    // Procesar venta
    const procesarVenta = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      // Si no se selecciona cliente, usar Cliente General (id = 0)
    const clienteFinalId = clienteId ?? null;
      if (carrito.length === 0) {
        setError("Agrega al menos un producto");
        return;
      }
      setProcesando(true);
      try {
        const ventaPayload = {
          clienteId: clienteFinalId,
          tipoPago, // Efectivo, Tarjeta, Yape
          descuento,
          notas,
          detalles: carrito.map((d) => ({
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.subtotal,
            ventaId: 0,
          })),
        };
        const response = await axios.post("/api/pos/venta", ventaPayload);
        setModalOpen(false);
        setCarrito([]);
        setClienteId(undefined);
        setDescuento(0);
        setNotas("");
        listarVentas();
        // Obtener recibo en texto plano
        if (response.data?.id) {
          // setReciboVentaId eliminado
          try {
            const reciboResp = await axios.get(`/api/pos/recibo/${response.data.id}`);
            setReciboTexto(reciboResp.data.recibo);
          } catch {
            setReciboTexto('No se pudo obtener el recibo.');
          }
        } else {
          // setReciboVentaId eliminado
          setReciboTexto('');
        }
        setReciboModalOpen(true);
      } catch (err: any) {
        setError(err.response?.data?.mensaje || "Error al procesar la venta");
      } finally {
        setProcesando(false);
      }
    };

    // Métricas (ejemplo)
    // Solo ventas no canceladas
    const ventasNoCanceladas = ventas.filter(v => !v.cancelada);
    const ventasHoy = ventasNoCanceladas.filter(v => {
      const fecha = new Date(v.fecha);
      fecha.setHours(fecha.getHours() - 5);
      return fecha.toDateString() === new Date().toDateString();
    }).length;
    const totalHoy = ventasNoCanceladas.filter(v => {
      const fecha = new Date(v.fecha);
      fecha.setHours(fecha.getHours() - 5);
      return fecha.toDateString() === new Date().toDateString();
    }).reduce((acc, v) => acc + v.total, 0);
    const clientesUnicos = [...new Set(ventasNoCanceladas.filter(v => {
      const fecha = new Date(v.fecha);
      fecha.setHours(fecha.getHours() - 5);
      return fecha.toDateString() === new Date().toDateString();
    }).map(v => v.clienteId))].length;

    function filtrarPorFecha(ventas: VentaDTO[]) {
      const ahora = new Date();
      if (filtroFecha === 'hoy') {
        return ventas.filter(v => {
          const fecha = new Date(v.fecha);
          fecha.setHours(fecha.getHours() - 5);
          return fecha.toDateString() === ahora.toDateString();
        });
      }
      if (filtroFecha === 'semana') {
        const inicioSemana = new Date(ahora);
        inicioSemana.setDate(ahora.getDate() - ahora.getDay());
        inicioSemana.setHours(0,0,0,0);
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);
        finSemana.setHours(23,59,59,999);
        return ventas.filter(v => {
          const fecha = new Date(v.fecha);
          fecha.setHours(fecha.getHours() - 5);
          return fecha >= inicioSemana && fecha <= finSemana;
        });
      }
      if (filtroFecha === 'mes') {
        return ventas.filter(v => {
          const fecha = new Date(v.fecha);
          fecha.setHours(fecha.getHours() - 5);
          return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        });
      }
      return ventas;
    }

    // En la tabla de productos y en el carrito de venta, muestra el campo precioPromocional si existe, si no, muestra el precio normal.
const obtenerPrecioProducto = (producto: ProductoDTO) => {
  return producto.precioPromocional ?? producto.precioVenta;
};

    return (
      <div className="max-w-full w-full min-h-screen bg-[#F6F6F6] font-inter pb-16">
        {/* Header blanco con barra de usuario */}
        <div className="w-full bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2"><ShoppingCart className="w-7 h-7 text-blue-600" /> Punto de Venta (POS)</h1>
            <p className="text-gray-500 text-sm">Gestión y registro de ventas</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Administrador</span>
            <Users className="text-gray-400" size={32} />
          </div>
        </div>
        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 pt-8">
          <div className="bg-gray-900 rounded-2xl shadow-lg flex flex-col justify-between p-8 text-white relative">
            <div className="flex items-center gap-4 mb-4">
              <BarChart className="text-white" size={36} />
              <span className="text-lg font-semibold">Ventas hoy</span>
            </div>
            <div className="text-4xl font-extrabold mb-2">{ventasHoy}</div>
            <div className="flex gap-6 text-sm opacity-80">
              <span>{ventasHoy} ventas</span>
              <span>Total: Bs {totalHoy.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow flex flex-col justify-between p-8 border border-gray-100">
            <CreditCard className="text-green-500" size={36} />
            <span className="text-lg font-semibold text-gray-700 mt-4">Total vendido hoy</span>
            <div className="text-3xl font-extrabold text-green-500 mb-2 mt-2">Bs {totalHoy.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow flex flex-col justify-between p-8 border border-gray-100">
            <Users className="text-purple-500" size={36} />
            <span className="text-lg font-semibold text-gray-700 mt-4">Clientes únicos</span>
            <div className="text-3xl font-extrabold text-purple-500 mb-2 mt-2">{clientesUnicos}</div>
          </div>
          <div className="bg-white rounded-2xl shadow flex flex-col justify-between p-8 border border-gray-100">
            <ShoppingCart className="text-blue-600" size={36} />
            <span className="text-lg font-semibold text-gray-700 mt-4">Ventas totales</span>
            <div className="text-3xl font-extrabold text-blue-600 mb-2 mt-2">{ventasNoCanceladas.length}</div>
          </div>
        </div>
        {/* Botón registrar venta */}
        <div className="flex justify-end mt-8 px-8">
          <button
            className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow font-inter transition flex items-center gap-2"
            onClick={() => setModalOpen(true)}
          >
            <span className="font-bold text-lg">＋</span> Registrar nueva venta
          </button>
        </div>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.18)] p-8 w-full max-w-3xl border border-[#E3E6F3] relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-[#F25C5C] text-2xl font-bold"
                onClick={() => setModalOpen(false)}
                aria-label="Cerrar"
                type="button"
              >×</button>
              <h2 className="text-2xl font-bold text-[#3A6B8A] mb-6 font-inter flex items-center gap-2 justify-center"><ShoppingCart className="w-6 h-6 text-blue-600" /> Registrar Nueva Venta</h2>
              <form onSubmit={procesarVenta} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {/* Buscador de productos */}
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Buscar producto</label>
                  <input
                    type="text"
                    placeholder="Nombre o código"
                    value={busquedaProducto}
                    onChange={e => setBusquedaProducto(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter mb-2"
                  />
                  <div className="max-h-40 overflow-y-auto mb-4">
                    {productosFiltrados.slice(0, 8).map((p) => (
                      <div
                        key={p.id}
                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-blue-50 transition ${p.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => agregarProductoCarrito(p)}
                      >
                        <img src={p.imagenUrl || "https://via.placeholder.com/48x48?text=Sin+Imagen"} alt={p.nombre} className="w-12 h-12 object-cover rounded-xl border" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{p.nombre}</div>
                          <div className="text-xs text-gray-500">{p.codigo}</div>
                          <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                        </div>
                        <div className="font-bold text-blue-700">Bs {obtenerPrecioProducto(p).toFixed(2)}</div>
                      </div>
                    ))}
                    {busquedaProducto && productosFiltrados.length === 0 && (
                      <div className="text-gray-500 text-sm p-2">No se encontraron productos</div>
                    )}
                  </div>

                  {/* Carrito */}
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Carrito</h3>
                  <div className="bg-gray-50 rounded-xl p-2 max-h-48 overflow-y-auto border border-gray-100">
                    {carrito.length === 0 ? (
                      <div className="text-gray-500 text-sm">Agrega productos al carrito</div>
                    ) : (
                      carrito.map((d) => (
                        <div key={d.productoId} className="flex items-center gap-2 mb-2">
                          <img src={d.producto?.imagenUrl || "https://via.placeholder.com/32x32?text=Sin+Imagen"} alt={d.producto?.nombre} className="w-8 h-8 object-cover rounded-xl border" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{d.producto?.nombre}</div>
                            <div className="text-xs text-gray-500">{d.producto?.codigo}</div>
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={d.producto?.stock || 99}
                            value={d.cantidad}
                            onChange={e => cambiarCantidadCarrito(d.productoId, Math.max(1, Math.min(Number(e.target.value), d.producto?.stock || 99)))}
                            className="w-16 border border-gray-300 rounded-xl p-1 text-center font-inter"
                          />
                          <div className="font-semibold text-gray-800">Bs {d.subtotal.toFixed(2)}</div>
                          <button type="button" className="text-red-500 hover:text-red-700 font-bold px-2" onClick={() => quitarProductoCarrito(d.productoId)}>&times;</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  {/* Cliente selector */}
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Cliente</label>
                  <select
                    value={clienteId ?? ""}
                    onChange={e => setClienteId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter mb-4"
                  >
                    <option value="">Cliente General</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>
                    ))}
                  </select>


                  {/* Tipo de pago */}
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Tipo de pago</label>
                  <select
                    value={tipoPago}
                    onChange={e => setTipoPago(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter mb-4"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Yape">Yape</option>
                  </select>

                  {/* Descuento */}
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Descuento (Bs)</label>
                  <input
                    type="number"
                    min={0}
                    max={totalVenta}
                    value={descuento}
                    onChange={e => setDescuento(Math.max(0, Math.min(Number(e.target.value), totalVenta)))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter mb-4"
                  />

                  {/* Notas */}
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Notas</label>
                  <textarea
                    value={notas}
                    onChange={e => setNotas(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter mb-4"
                    rows={2}
                    placeholder="Notas adicionales"
                  />

                  {/* Resumen */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
                    <div className="flex justify-between font-semibold text-lg text-gray-800">
                      <span>Total:</span>
                      <span>Bs {totalVenta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-blue-700 font-semibold">
                      <span>Descuento:</span>
                      <span>- Bs {descuento.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl mt-2 text-gray-800">
                      <span>Total a pagar:</span>
                      <span>Bs {totalFinal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Error */}
                  {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      className="bg-[#E3B505] hover:bg-[#C9A004] text-white px-6 py-3 rounded-xl font-semibold shadow font-inter"
                      onClick={() => setModalOpen(false)}
                      disabled={procesando}
                    >Cancelar</button>
                    <button
                      type="submit"
                      className="bg-[#3A6B8A] hover:bg-[#29506A] text-white px-6 py-3 rounded-xl font-semibold shadow font-inter flex items-center gap-2"
                      disabled={procesando}
                    >{procesando ? "Procesando..." : "Registrar Venta"}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal recibo venta */}
  {reciboModalOpen && reciboTexto && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center print:bg-white print:bg-opacity-100">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative print:shadow-none print:border-none print:p-0 print:max-w-xs print:rounded-none">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 print:hidden" onClick={() => setReciboModalOpen(false)}>&times;</button>
              <div className="flex flex-col items-center gap-2 print:gap-0">
                <h2 className="text-xl font-bold mb-2 text-blue-700 font-inter print:text-base print:mb-1">Recibo de Venta</h2>
                <div className="w-full bg-white rounded-xl border border-gray-200 p-4 font-mono text-sm text-gray-800 shadow-sm print:border-none print:rounded-none print:p-2 print:shadow-none">
                  {/* Encabezado tienda */}
                  <div className="text-center font-bold text-gray-900 mb-2 print:mb-1 text-base print:text-xs">Bodega POS</div>
                  <div className="text-center text-xs text-gray-500 mb-2 print:mb-1">{new Date().toLocaleString()}</div>
                  <hr className="my-2 print:my-1 border-gray-300" />
                  {/* Recibo info */}
                  <div className="mb-2 print:mb-1">
                    <div><span className="font-semibold">Cliente:</span> {reciboTexto.includes('Cliente') ? reciboTexto.match(/Cliente: (.*)/)?.[1] : 'Cliente General'}</div>
                    <div><span className="font-semibold">Pago:</span> {reciboTexto.includes('Tipo de pago') ? reciboTexto.match(/Tipo de pago: (.*)/)?.[1] : ''}</div>
                  </div>
                  <hr className="my-2 print:my-1 border-gray-300" />
                  {/* Productos */}
                  <div className="mb-2 print:mb-1">
                    <div className="font-semibold mb-1">Productos:</div>
                    {reciboTexto.split('Productos:')[1]?.split('Total:')[0]?.split('\n').filter(l => l.trim()).map((line, idx) => (
                      <div key={idx} className="flex justify-between text-xs print:text-[10px]">
                        <span>{line.replace(/\s*-\s*/g, ' - ').replace(/S\//g, 'Bs ')}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="my-2 print:my-1 border-gray-300" />
                  {/* Totales */}
                  <div className="mb-2 print:mb-1">
                    {reciboTexto.split('Total:').slice(1).map((block, idx) => (
                      <div key={idx} className="flex justify-between text-xs print:text-[10px]">
                        <span>{block.split('\n')[0].replace(/\s*-\s*/g, ' - ').replace(/S\//g, 'Bs ')}</span>
                        <span>{block.split('\n')[1]?.replace(/\s*-\s*/g, ' - ').replace(/S\//g, 'Bs ')}</span>
                      </div>
                    ))}
                  </div>
                  {/* Footer */}
                  <div className="text-center text-xs text-gray-400 mt-2 print:mt-1">¡Gracias por su compra!</div>
                </div>
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-semibold shadow font-inter w-full mt-4 print:hidden"
                  onClick={() => window.print()}
                >Imprimir recibo</button>
              </div>
            </div>
          </div>
        )}
        {/* Historial de Ventas */}
        <div className="bg-white rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.08)] p-8 border border-[#F0F1F6] mt-4 mx-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 font-inter flex items-center gap-2"><BarChart className="w-6 h-6 text-blue-600" /> Historial de Ventas</h2>
          <div className="flex items-center gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mostrarCanceladas}
                onChange={e => setMostrarCanceladas(e.target.checked)}
                className="accent-blue-600 w-5 h-5 rounded"
              />
              <span className="text-sm text-gray-700">Mostrar ventas canceladas</span>
            </label>
            <select
              value={filtroFecha}
              onChange={e => setFiltroFecha(e.target.value as 'hoy' | 'semana' | 'mes')}
              className="border border-gray-300 rounded-xl px-4 py-2 font-inter text-sm"
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>
          </div>
          <div className="flex flex-col gap-8">
            {(() => {
              // Filtra y ordena ventas para mostrar en el historial
              const ventasFiltradas = ventas.filter(v => mostrarCanceladas || !v.cancelada);
              const ventasOrdenadas = filtrarPorFecha(ventasFiltradas).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
              return ventasOrdenadas.map((venta: VentaDTO) => (
              <div key={venta.id} className="rounded-2xl shadow border border-gray-200 bg-white flex flex-col p-6 relative font-inter hover:scale-[1.01] transition">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-lg font-bold text-gray-900">Venta #{venta.id}</span>
                  {venta.cancelada ? (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">Cancelada</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">completada</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-700 text-sm mb-2">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {(venta.cliente?.id === 0 || !venta.cliente) ? "Cliente General" : `${venta.cliente?.nombres || "Sin cliente"} ${venta.cliente?.apellidos || ""}`}</span>
                  <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4" /> {venta.detalles?.length || 0} items</span>
                  <span className="flex items-center gap-1"><BarChart className="w-4 h-4" /> {
                    (() => {
                      const fecha = new Date(venta.fecha);
                      fecha.setHours(fecha.getHours() - 5);
                      return `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    })()
                  }</span>
                </div>
                <div className="mb-2 text-gray-700 text-sm">
                  <span className="font-semibold">Productos:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {venta.detalles?.map((d: DetalleVentaDTO, idx: number) => (
                      <li key={idx}>{d.producto?.nombre || "Producto"} - {d.cantidad}x</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold text-gray-900">Bs {venta.total.toFixed(2)}</div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded-full border border-blue-100 flex items-center gap-1" title="Ver detalles">
                      <BarChart className="w-4 h-4" />
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-xl font-semibold shadow font-inter flex items-center gap-1"
                      onClick={() => mostrarReciboVenta(venta.id!)}
                      title="Imprimir recibo"
                    >
                      <span className="font-bold">🧾</span> Imprimir recibo
                    </button>
                    {!venta.cancelada && (
                      <button
                        className="bg-[#F25C5C] hover:bg-[#C0392B] text-white px-4 py-2 rounded-xl font-semibold shadow transition font-inter flex items-center gap-1"
                        onClick={() => abrirCancelarVenta(venta)}
                      >
                        <span className="font-bold">×</span> Cancelar
                      </button>
                    )}
                  </div>
                </div>
                {/* Modal cancelar venta */}
                {cancelarModalOpen && ventaCancelar?.id === venta.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.18)] p-8 w-full max-w-md border border-[#E3E6F3] relative">
                      <button className="absolute top-4 right-4 text-gray-400 hover:text-[#F25C5C] text-2xl font-bold" onClick={() => setCancelarModalOpen(false)} aria-label="Cerrar">×</button>
                      <h2 className="text-xl font-bold text-[#F25C5C] mb-4 text-center font-inter">Cancelar Venta</h2>
                      <form onSubmit={cancelarVenta}>
                        <label className="block text-sm font-semibold text-[#F25C5C] mb-1">Motivo de cancelación *</label>
                        <select
                          value={motivoCancelacion}
                          onChange={e => setMotivoCancelacion(e.target.value)}
                          className="w-full border border-gray-300 p-2.5 rounded-xl mb-4 font-inter"
                          required
                        >
                          <option value="">Selecciona un motivo</option>
                          <option value="error">Error</option>
                          <option value="devolucion">Devolución</option>
                          <option value="cliente no pagó">Cliente no pagó</option>
                          <option value="otro">Otro</option>
                        </select>
                        {motivoCancelacion.trim().toLowerCase() === "devolucion" && (
                          <div>
                            <label className="block text-sm font-semibold text-[#F25C5C] mb-1">Motivo de devolución *</label>
                            <input
                              type="text"
                              value={motivoDevolucion}
                              onChange={e => setMotivoDevolucion(e.target.value)}
                              className="w-full border border-gray-300 p-2.5 rounded-xl mb-4 font-inter"
                              required
                              placeholder="Describe el motivo de la devolución"
                            />
                          </div>
                        )}
                        {errorCancelar && <div className="text-red-600 font-semibold mb-2 font-inter">{errorCancelar}</div>}
                        <div className="flex justify-end gap-4 mt-6">
                          <button type="button" className="bg-[#E3B505] hover:bg-[#C9A004] text-white px-6 py-3 rounded-xl font-semibold shadow font-inter" onClick={() => setCancelarModalOpen(false)}>Cancelar</button>
                          <button type="submit" className="bg-[#F25C5C] hover:bg-[#C0392B] text-white px-6 py-3 rounded-xl font-semibold shadow font-inter">Confirmar Cancelación</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
              ));
            })()}
          </div>
        </div>
      </div>
    );
  };

  export default POSPage;
