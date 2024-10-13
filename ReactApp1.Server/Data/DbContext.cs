using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Data
{
    public class YourDbContext : DbContext
    {
        public YourDbContext(DbContextOptions<YourDbContext> options) : base(options)
        {
        }

        public DbSet<EmpleadoDto> Empleados { get; set; }

        public DbSet<GerenciaEmpleadoCount> GerenciaEmpleadoCounts { get; set; }

        public List<EmpleadoDto> ObtenerDatosEmpleado(int empleadoId)
        {
            try
            {
                return Empleados.FromSqlInterpolated($"EXEC sp_ObtenerDatosEmpleado @EmpleadoID = {empleadoId}").ToList();
            }
            catch (SqlException ex)
            {
                // Registrar el error si es necesario
                Console.WriteLine($"Error de SQL: {ex.Message}");

                // Lanza una excepción controlada o devuelve un mensaje de error personalizado
                throw new Exception("Error en la comunicación del sistema. Por favor, inténtelo de nuevo más tarde.");
            }
        }

        public List<EmpleadoDto> ObtenerDatosEmpleadoPorEmail(string email)
        {
            try
            {
                return Empleados.FromSqlInterpolated($"EXEC sp_ObtenerDatosEmpleadoPorEmail @Email = {email}").ToList();
            }
            catch (SqlException ex)
            {
                // Registrar el error si es necesario
                Console.WriteLine($"Error de SQL: {ex.Message}");

                // Lanza una excepción controlada o devuelve un mensaje de error personalizado
                throw new Exception("Error en la comunicación del sistema. Por favor, inténtelo de nuevo más tarde.");
            }
        }

    public DbSet<AppInfo> usuarios { get; set; }

        public List<AppInfo> ObtenerDatosUsuarios(int empleadoId)
        {
            try
            {
                return usuarios.FromSqlInterpolated($"EXEC sp_ObtenerUsuariosAsignados @EmpleadoID = {empleadoId}").ToList();
            }
            catch (SqlException ex)
            {
                // Aquí puedes registrar el error si lo deseas
                Console.WriteLine($"Error de SQL: {ex.Message}");

                // Lanza una excepción controlada o devuelve un mensaje de error personalizado
                throw new Exception("Error en la comunicación del sistema. Por favor, inténtelo de nuevo más tarde.");
            }
        }

        public List<AppInfo> ObtenerDatosUsuarioPorEmail(string email)
        {
            try
            {
                return usuarios.FromSqlInterpolated($"EXEC sp_ObtenerUsuariosAsignadosPorEmail @Email = {email}").ToList();
            }
            catch (SqlException ex)
            {
                // Registrar el error si es necesario
                Console.WriteLine($"Error de SQL: {ex.Message}");

                // Lanza una excepción controlada o devuelve un mensaje de error personalizado
                throw new Exception("Error en la comunicación del sistema. Por favor, inténtelo de nuevo más tarde.");
            }
        }

        public List<GerenciaEmpleadoCount> ContarEmpleadosPorGerencia()
        {
            try
            {
                return GerenciaEmpleadoCounts.FromSqlRaw("EXEC ContarEmpleadosPorGerencia").ToList();
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Error de SQL: {ex.Message}");
                throw new Exception("Error en la comunicación del sistema. Por favor, inténtelo de nuevo más tarde.");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // No tiene llave primaria
            modelBuilder.Entity<GerenciaEmpleadoCount>().HasNoKey();
        }

    }

// Definir las clases
public class Usuario
    {
        [Key]
        public string usuario { get; set; }
        public int id_empleado { get; set; }
        public int id_aplicacion { get; set; }
        public DateTime fecha_creacion { get; set; }
        public string estado { get; set; }
        public int no_caso { get; set; }
    }

    public class EmpleadoDto
    {
        [Key]
        public int id_empleado { get; set; }
        public string nombres { get; set; }
        public string apellidos { get; set; }
        public int DPI { get; set; }
        public string Email { get; set; }
        public DateTime fecha_nacimiento { get; set; }
        public string Puesto { get; set; }
        public string Gerencia { get; set; }
        public string NombreJefe { get; set; }
        public String TelefonoJefe { get; set; }
        public string estado { get; set; }
    }

    public class AppInfo
    {
        [Key]
        public string usuario { get; set; }
        public string email { get; set; }
        public string nombrecompleto { get; set; }
        public string nombreaplicacion { get; set; }
        public DateTime fecha_creacion { get; set; }
        public String estado { get; set; }
        public int no_caso { get; set; }
    }

    public class GerenciaEmpleadoCount
    {
        public string nombre { get; set; }
        public int total_empleados { get; set; }
    }

}
