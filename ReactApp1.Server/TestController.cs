using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Data;
using System.Linq;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly YourDbContext _context;

        public TestController(YourDbContext context)
        {
            _context = context;
        }
        [HttpGet("PorID/{empleadoId}")]
        public IActionResult ObtenerEmpleadoPorID(int empleadoId)
        {
            var data = _context.ObtenerDatosEmpleado(empleadoId);
            return Ok(data);
        }

        [HttpGet("PorEmail")]
        public IActionResult ObtenerEmpleadoPorEmail(string email)
        {
            var data = _context.ObtenerDatosEmpleadoPorEmail(email);
            return Ok(data);
        }

        [HttpGet("UID/{empleadoId}")]
        public IActionResult ObtenerDatosUsuarios(int empleadoId)
        {
            var data = _context.ObtenerDatosUsuarios(empleadoId);
            return Ok(data);
        }

        [HttpGet("UEmail")]
        public IActionResult ObtenerDatosUsuarioPorEmail(string email)
        {
            var data = _context.ObtenerDatosUsuarioPorEmail(email);
            return Ok(data);
        }

        [HttpGet("ContarEmpleadosPorGerencia")]
        public IActionResult ContarEmpleadosPorGerencia()
        {
            var data = _context.ContarEmpleadosPorGerencia();
            return Ok(data);
        }
    }
}
