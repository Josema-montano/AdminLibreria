using Aplication.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Aplication.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapeo de Proveedor
            CreateMap<Proveedor, ProveedorDTO>().ReverseMap();
    
            // Mapeo de Cliente
            CreateMap<Cliente, ClienteDTO>().ReverseMap();
            
            // Mapeo de Producto con su Proveedor
            CreateMap<Producto, ProductoDTO>()
                .ForMember(dest => dest.Proveedor, opt => opt.MapFrom(src => src.Proveedor))
                .ReverseMap();
      
            // Mapeo de Promoci�n con sus productos
            CreateMap<Promocion, PromocionDTO>()
                .ForMember(dest => dest.Productos, opt => opt.MapFrom(src => src.Productos))
                .ReverseMap();
     
            // Mapeo de PromocionProducto
            CreateMap<PromocionProducto, PromocionProductoDTO>()
                .ForMember(dest => dest.Producto, opt => opt.MapFrom(src => src.Producto))
                .ReverseMap();
            
            // Mapeo de MovimientoInventario con conversi�n de enum
            CreateMap<MovimientoInventario, MovimientoInventarioDTO>()
                .ForMember(dest => dest.Tipo, opt => opt.MapFrom(src => src.Tipo.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.Tipo, opt => opt.MapFrom(src => Enum.Parse<TipoMovimientoInventario>(src.Tipo)));

            // Mapeo de Devolucion
            CreateMap<Devolucion, DevolucionDTO>().ReverseMap();

            // Mapeo de Venta y DetalleVenta
            CreateMap<Venta, VentaDTO>()
                .ForMember(dest => dest.Detalles, opt => opt.MapFrom(src => src.Detalles))
                .ReverseMap();
            CreateMap<DetalleVenta, DetalleVentaDTO>().ReverseMap();
        }
    }
}
