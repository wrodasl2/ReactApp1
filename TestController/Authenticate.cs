using NUnit.Framework;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Controllers;
using Microsoft.Extensions.Configuration;

namespace ReactApp1.Tests
{
    [TestFixture] // Atributo que indica que esta clase contiene pruebas NUnit
    public class AuthControllerTests
    {
        private AuthController _authController;

        [SetUp] // Método que se ejecuta antes de cada prueba para configurar el estado inicial
        public void Setup()
        {
            // Crear una configuración vacía para las pruebas
            var config = new ConfigurationBuilder().AddInMemoryCollection().Build();
            _authController = new AuthController(config);
        }

        [Test] // Método de prueba para credenciales vacías
        public void Authenticate_EmptyUsernameOrPassword_ReturnsBadRequest()
        {
            // Arrange
            var userLogin = new UserLogin
            {
                Username = "",
                Password = ""
            };

            // Act
            var result = _authController.Authenticate(userLogin);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult, "El resultado debe ser BadRequestObjectResult");
            Assert.AreEqual("El usuario y/o la contraseña no pueden estar vacíos.", ((dynamic)badRequestResult.Value).message);
        }

        [Test] // Método de prueba para credenciales inválidas
        public void Authenticate_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var userLogin = new UserLogin
            {
                Username = "testuser",
                Password = "wrongpassword"
            };

            // Act
            var result = _authController.Authenticate(userLogin);

            // Assert
            var unauthorizedResult = result as UnauthorizedObjectResult;
            Assert.IsNotNull(unauthorizedResult, "El resultado debe ser UnauthorizedObjectResult");
            Assert.AreEqual("Error de usuario y/o contraseña.", ((dynamic)unauthorizedResult.Value).message);
        }

        [Test] // Método de prueba para credenciales válidas
        public void Authenticate_ValidCredentials_ReturnsOkWithToken()
        {
            // Arrange
            var userLogin = new UserLogin
            {
                Username = "testuser",
                Password = "correctpassword"
            };

            // Act
            var result = _authController.Authenticate(userLogin);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult, "El resultado debe ser OkObjectResult");
            var token = ((dynamic)okResult.Value).token;
            Assert.AreEqual("dummyToken", token, "El token devuelto no es el esperado.");
        }
    }
}
