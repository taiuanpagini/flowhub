using Microsoft.AspNetCore.Mvc;
using FlowHub.API.Models;
using FlowHub.API.Services;
using System.Text;

namespace FlowHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MockDataService _mockDataService;

    public AuthController(MockDataService mockDataService)
    {
        _mockDataService = mockDataService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // Busca usuário nos dados mockados
        var user = _mockDataService.Users
            .FirstOrDefault(u => u.Username == request.Username && u.Password == request.Password);

        if (user == null)
        {
            return Unauthorized(new { message = "Credenciais inválidas" });
        }

        // Gera token JWT mockado (não validado criptograficamente na POC)
        var token = GenerateMockToken(user);

        var userDto = new UserDto(
            user.Id,
            user.Name,
            user.Email,
            user.Role,
            user.Permissions,
            user.CustomerId,
            user.RedirectTo
        );

        return Ok(new LoginResponse(token, userDto));
    }

    private string GenerateMockToken(User user)
    {
        // Na POC, retorna um token simples (não é JWT real)
        // Na versão final, KeyCloak gerará tokens reais
        var payload = $"{user.Id}:{user.Role}:{DateTime.UtcNow.Ticks}";
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(payload));
    }
}
