using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Novell.Directory.Ldap;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Collections.Generic;
using System.Linq;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private static List<string> usedTokens = new List<string>(); // Almacén simple de tokens usados

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Diccionario para almacenar los tokens generados después de la autenticación exitosa
        private static Dictionary<string, string> generatedTokens = new Dictionary<string, string>(); // token -> username


        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserLogin userLogin)
        {
            if (string.IsNullOrWhiteSpace(userLogin.Username) || string.IsNullOrWhiteSpace(userLogin.Password))
            {
                return BadRequest(new { message = "El usuario y/o la contraseña no pueden estar vacíos." });
            }

            // Variable para almacenar el nombre completo del usuario
            string fullName = string.Empty;

            var isAuthenticated = AuthenticateAgainstAD(userLogin.Username, userLogin.Password, out fullName);

            if (isAuthenticated)
            {
                var token = GenerateToken(userLogin.Username, fullName);

                // Almacenar el token generado asociado al usuario
                generatedTokens[token] = userLogin.Username;

                return Ok(new { token });
            }
            else
            {
                return Unauthorized(new { message = "Error de usuario y/o contraseña." });
            }
        }


        // Declarar el diccionario a nivel de clase
        private static Dictionary<string, int> tokenUsages = new Dictionary<string, int>();

        [HttpPost("validate-token")]
        public IActionResult ValidateToken([FromBody] string token)
        {
            // Verificar si el token fue previamente generado durante la autenticación
            if (!generatedTokens.ContainsKey(token))
            {
                return Unauthorized(new { message = "El token no fue generado por una autenticación válida." });
            }

            const int maxUsosPermitidos = 2; // Número máximo de veces que el token puede ser usado

            if (tokenUsages.ContainsKey(token))
            {
                // Si el token ya ha sido usado 3 veces, devolvemos un error
                if (tokenUsages[token] >= maxUsosPermitidos)
                {
                    return Unauthorized(new { message = "El token ha alcanzado el número máximo de usos permitidos." });
                }
                // Si aún no ha alcanzado el límite, incrementamos el contador
                tokenUsages[token]++;
            }
            else
            {
                // Si es la primera vez que se usa el token, lo registramos con un conteo de 1
                tokenUsages[token] = 1;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            try
            {
                // Validar el token asegurándose de que coincidan la firma, emisor y audiencia
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true, // Validar que no haya expirado
                    ValidateIssuerSigningKey = true, // Validar que la firma sea válida

                    ValidIssuer = _configuration["Jwt:Issuer"], // Emisor esperado
                    ValidAudience = _configuration["Jwt:Issuer"], // Audiencia esperada
                    IssuerSigningKey = new SymmetricSecurityKey(key), // Clave con la que se firmó el token
                    ClockSkew = TimeSpan.Zero // No permitir desfase de tiempo
                }, out SecurityToken validatedToken);

                return Ok(new { message = $"Token válido. Usos restantes: {maxUsosPermitidos - tokenUsages[token]}" });
            }
            catch (SecurityTokenException)
            {
                return Unauthorized(new { message = "Token inválido o no autorizado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al validar el token: {ex.Message}" });
            }
        }


        private bool AuthenticateAgainstAD(string username, string password, out string fullName)
        {
            fullName = null;
            try
            {
                using (var connection = new LdapConnection { SecureSocketLayer = false })
                {
                    // Conectar al servidor LDAP
                    connection.Connect("192.168.217.128", LdapConnection.DefaultPort); // Conexión hacia AD

                    // Construir el nombre de usuario con el dominio
                    string userDn = $@"{username}@domclaro.local";

                    // Autenticar con las credenciales del usuario
                    connection.Bind(userDn, password);

                    if (connection.Bound)
                    {
                        // Buscar el nombre completo del usuario en el AD
                        string searchFilter = $"(sAMAccountName={username})";
                        string? searchBase = _configuration["Ldap:BaseDn"];

                        if (string.IsNullOrEmpty(searchBase))
                        {
                            throw new InvalidOperationException("El valor de Ldap:BaseDn no puede ser nulo o vacío.");
                        }

                        return true;
                    }

                    return false;
                }
            }
            catch (LdapException ldapEx)
            {
                Console.WriteLine($"Error de LDAP: {ldapEx.Message} - StackTrace: {ldapEx.StackTrace}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general: {ex.Message} - StackTrace: {ex.StackTrace}");
                return false;
            }
        }

        private string GenerateToken(string username, string fullName)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Asegurarse de que fullName no sea nulo
            fullName = fullName ?? "Usuario"; // Asignar "Usuario" como valor por defecto si fullName es nulo

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, username),
        new Claim("fullName", fullName), // Incluir el nombre completo en el token
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(5), // Token de vida corta
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }


        public class UserLogin
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}