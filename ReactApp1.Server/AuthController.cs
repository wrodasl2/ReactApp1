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

        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserLogin userLogin)
        {
            var isAuthenticated = AuthenticateAgainstAD(userLogin.Username, userLogin.Password);

            if (isAuthenticated)
            {
                var token = GenerateToken(userLogin.Username);
                return Ok(new { token });
            }

            return Unauthorized();
        }

        [HttpPost("validate-token")]
        public IActionResult ValidateToken([FromBody] string token)
        {
            if (usedTokens.Contains(token))
            {
                return Unauthorized(); // El token ya ha sido usado
            }

            // Marcar el token como usado
            usedTokens.Add(token);

            // Validar token
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken != null && jsonToken.ValidTo > DateTime.UtcNow)
            {
                return Ok(); // Token válido
            }

            return Unauthorized(); // Token inválido
        }

        private bool AuthenticateAgainstAD(string username, string password)
        {
            try
            {
                using (var connection = new LdapConnection { SecureSocketLayer = false })
                {
                    // Conectar al servidor LDAP
                    connection.Connect("192.168.217.128", LdapConnection.DefaultPort); // Cambia a DefaultSslPort si estás usando SSL

                    // Construir el nombre de usuario con el dominio si es necesario
                    string userDn = $@"{username}@domclaro.local"; // O podrías usar "username@domclaro.local"

                    // Autenticar con las credenciales del usuario
                    connection.Bind(userDn, password);

                    return connection.Bound;
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




        private string GenerateToken(string username)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
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
