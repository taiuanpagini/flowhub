namespace FlowHub.API.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public List<string> Permissions { get; set; } = new();
    public string? CustomerId { get; set; }
    public string RedirectTo { get; set; } = string.Empty;
}

public record LoginRequest(string Username, string Password);

public record LoginResponse(string Token, UserDto User);

public record UserDto(
    string Id,
    string Name,
    string Email,
    string Role,
    List<string> Permissions,
    string? CustomerId,
    string RedirectTo
);
