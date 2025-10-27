# Sistema de Gesti�n para Librer�as y Papeler�as

## Descripci�n
Sistema backend desarrollado para optimizar la administraci�n de una librer�a o papeler�a mediante la automatizaci�n del registro y control de productos. Permite administrar cuentas de clientes y proveedores, generar alertas por stock m�nimo, controlar devoluciones, gestionar inventarios y promociones.

## Arquitectura del Proyecto

El proyecto sigue una **Arquitectura en Capas (Layered Architecture)** con tres capas principales:

### 1. **Domain (Capa de Dominio)**
Contiene las entidades del negocio y las interfaces de los repositorios.

#### Entidades:
- **Cliente**: Gesti�n de datos de clientes (Nombres, Apellidos, Documento, Tel�fono, Email, Direcci�n)
- **Proveedor**: Gesti�n de datos de proveedores (Nombre, RUC, Tel�fono, Email, Direcci�n)
- **Producto**: Gesti�n de productos (C�digo, Nombre, Descripci�n, Precios, Stock, StockM�nimo)
- **Promocion**: Gesti�n de promociones con fechas de inicio y fin
- **PromocionProducto**: Relaci�n muchos a muchos entre Promociones y Productos con descuento
- **Devolucion**: Registro de devoluciones de productos por clientes
- **MovimientoInventario**: Registro de movimientos de entrada/salida de inventario
- **TipoMovimientoInventario**: Enum para tipos de movimiento (Ingreso/Egreso)

#### Interfaces:
- `IClienteRepositorio`
- `IProveedorRepositorio`
- `IProductoRepositorio`
- `IPromocionRepositorio`
- `IDevolucionRepositorio`
- `IMovimientoInventarioRepositorio`

### 2. **Aplication (Capa de Aplicaci�n)**
Contiene los casos de uso y la l�gica de negocio de la aplicaci�n.

#### DTOs (Data Transfer Objects):
- `ClienteDTO`
- `ProveedorDTO`
- `ProductoDTO`
- `PromocionDTO`
- `PromocionProductoDTO`
- `DevolucionDTO`
- `MovimientoInventarioDTO`

#### Mapping:
- **MappingProfile**: Configuraci�n de AutoMapper para mapeo entre entidades y DTOs

#### Casos de Uso:

**Clientes:**
- `CrearCliente`: Crear nuevo cliente con validaciones
- `ActualizarCliente`: Actualizar datos de cliente existente
- `EliminarCliente`: Eliminar cliente
- `ListarClientes`: Listar todos los clientes
- `ObtenerClientePorId`: Obtener cliente espec�fico por ID

**Proveedores:**
- `CrearProveedor`: Crear nuevo proveedor con validaciones
- `ActualizarProveedor`: Actualizar datos de proveedor existente
- `EliminarProveedor`: Eliminar proveedor
- `ListarProveedores`: Listar todos los proveedores
- `ObtenerProveedorPorId`: Obtener proveedor espec�fico por ID

**Productos:**
- `CrearProducto`: Crear nuevo producto con validaci�n de c�digo �nico
- `ActualizarProducto`: Actualizar datos de producto existente
- `EliminarProducto`: Eliminar producto
- `ListarProductos`: Listar productos (con opci�n de incluir proveedor)
- `ObtenerProductoPorId`: Obtener producto espec�fico por ID
- `ObtenerProductoPorCodigo`: Obtener producto por c�digo de barras

**Promociones:**
- `CrearPromocion`: Crear nueva promoci�n con productos y descuentos
- `ActualizarPromocion`: Actualizar promoci�n existente
- `EliminarPromocion`: Eliminar promoci�n
- `ListarPromociones`: Listar promociones (con opci�n de solo activas)
- `ObtenerPromocionPorId`: Obtener promoci�n espec�fica por ID
- `GestionarPromocion`: Gesti�n completa de promociones y estado

**Inventario:**
- `ActualizarInventario`: Registrar movimientos de inventario (entrada/salida)
- `GenerarAlertasStockMinimo`: Generar alertas de productos con stock bajo el m�nimo
- `ListarMovimientosPorProducto`: Listar historial de movimientos de un producto

**Devoluciones:**
- `RegistrarDevolucion`: Registrar devoluci�n de producto con actualizaci�n de inventario
- `ListarDevoluciones`: Listar todas las devoluciones
- `ObtenerDevolucionPorId`: Obtener devoluci�n espec�fica por ID

### 3. **Infrastructure (Capa de Infraestructura)**
Implementaci�n de acceso a datos y persistencia.

#### Data:
- **AppDbContext**: Contexto de Entity Framework Core con configuraci�n de relaciones

#### Repositorios:
- `ClienteRepositorio`: Implementaci�n CRUD para Clientes
- `ProveedorRepositorio`: Implementaci�n CRUD para Proveedores
- `ProductoRepositorio`: Implementaci�n CRUD para Productos con Include de Proveedor
- `PromocionRepositorio`: Implementaci�n para Promociones con productos relacionados
- `DevolucionRepositorio`: Implementaci�n para Devoluciones
- `MovimientoInventarioRepositorio`: Implementaci�n para Movimientos de Inventario

## Caracter�sticas Principales

### 1. Gesti�n de Inventario
- Control de stock en tiempo real
- Alertas autom�ticas de stock m�nimo
- Registro de movimientos de entrada y salida
- Historial de movimientos por producto

### 2. Gesti�n de Promociones
- Creaci�n de promociones con m�ltiples productos
- Descuentos por porcentaje (0-100%)
- Control de fechas de vigencia
- Activaci�n/desactivaci�n de promociones

### 3. Control de Devoluciones
- Registro de devoluciones con motivo
- Actualizaci�n autom�tica de inventario
- Asociaci�n opcional con clientes
- Trazabilidad completa

### 4. Validaciones de Negocio
Cada caso de uso incluye validaciones robustas:
- Validaci�n de datos requeridos
- Validaci�n de existencia de entidades
- Validaci�n de rangos y valores
- Validaci�n de stock suficiente para egresos
- Validaci�n de c�digos �nicos para productos

## Tecnolog�as Utilizadas

- **.NET** (Framework principal)
- **Entity Framework Core** (ORM)
- **AutoMapper** (Mapeo de objetos)
- **Arquitectura en Capas** (Patr�n arquitect�nico)
- **Repository Pattern** (Patr�n de dise�o)
- **Dependency Injection** (Inversi�n de dependencias)

## Principios Aplicados

- **Separation of Concerns**: Cada capa tiene responsabilidades bien definidas
- **Single Responsibility**: Cada clase tiene una �nica raz�n de cambio
- **Dependency Inversion**: Las capas superiores dependen de abstracciones
- **Open/Closed**: Abierto a extensi�n, cerrado a modificaci�n
- **CRUD Operations**: Operaciones b�sicas de Create, Read, Update, Delete

## Estructura de Archivos

```
ProyectoFinal/
??? Domain/
?   ??? Entities/
?   ?   ??? Cliente.cs
?   ?   ??? Proveedor.cs
?   ?   ??? Producto.cs
?   ?   ??? Promocion.cs
?   ?   ??? PromocionProducto.cs
?   ?   ??? Devolucion.cs
?   ?   ??? MovimientoInventario.cs
?   ? ??? TipoMovimientoInventario.cs
?   ??? Interfaces/
?       ??? IClienteRepositorio.cs
?       ??? IProveedorRepositorio.cs
?       ??? IProductoRepositorio.cs
?       ??? IPromocionRepositorio.cs
?       ??? IDevolucionRepositorio.cs
?       ??? IMovimientoInventarioRepositorio.cs
?
??? Aplication/
?   ??? DTOs/
?   ?   ??? ClienteDTO.cs
??   ??? ProveedorDTO.cs
?   ?   ??? ProductoDTO.cs
?   ?   ??? PromocionDTO.cs
?   ?   ??? DevolucionDTO.cs
?   ?   ??? MovimientoInventarioDTO.cs
?   ??? Mapping/
?   ?   ??? MappingProfile.cs
?   ??? UseCases/
?       ??? Clientes/
?       ?   ??? CrearCliente.cs
?       ?   ??? ActualizarCliente.cs
?       ?   ??? EliminarCliente.cs
?       ?   ??? ListarClientes.cs
?       ?   ??? ObtenerClientePorId.cs
?     ??? Proveedores/
?    ?   ??? CrearProveedor.cs
?     ?   ??? ActualizarProveedor.cs
?  ?   ??? EliminarProveedor.cs
?       ? ??? ListarProveedores.cs
?       ?   ??? ObtenerProveedorPorId.cs
? ??? Productos/
?       ?   ??? CrearProducto.cs
?       ?   ??? ActualizarProducto.cs
?       ?   ??? EliminarProducto.cs
?       ?   ??? ListarProductos.cs
?       ?   ??? ObtenerProductoPorId.cs
?       ?   ??? ObtenerProductoPorCodigo.cs
?     ??? Promociones/
?  ?   ??? CrearPromocion.cs
?       ?   ??? ActualizarPromocion.cs
?  ?   ??? EliminarPromocion.cs
? ?   ??? ListarPromociones.cs
?       ?   ??? ObtenerPromocionPorId.cs
?       ?   ??? GestionarPromocion.cs
?     ??? Devoluciones/
?   ?   ??? RegistrarDevolucion.cs
?       ?   ??? ListarDevoluciones.cs
? ?   ??? ObtenerDevolucionPorId.cs
?       ??? Inventario/
?      ??? ActualizarInventario.cs
?           ??? GenerarAlertasStockMinimo.cs
?           ??? ListarMovimientosPorProducto.cs
?
??? Infraestructure/
    ??? Data/
    ?   ??? AppDbContext.cs
    ??? Repositorios/
    ??? ClienteRepositorio.cs
        ??? ProveedorRepositorio.cs
   ??? ProductoRepositorio.cs
        ??? PromocionRepositorio.cs
        ??? DevolucionRepositorio.cs
        ??? MovimientoInventarioRepositorio.cs
```

## Compilaci�n

```bash
dotnet build
```

## Notas Importantes

- Las migraciones se generan autom�ticamente con Entity Framework Core
- Todos los casos de uso incluyen validaciones exhaustivas
- El sistema utiliza Guid para identificadores �nicos
- Las fechas se manejan en formato UTC
- El stock se actualiza autom�ticamente con movimientos de inventario
- Las devoluciones generan movimientos de inventario de tipo Ingreso

---

**Desarrollado con Clean Architecture y mejores pr�cticas de desarrollo de software.**
