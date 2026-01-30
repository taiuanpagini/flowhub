namespace ProWine.POC.API.Models;

public class ServiceRequest
{
    public string Id { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
    public string StandNumber { get; set; } = string.Empty;
    public int RequestedGlassQuantity { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed
    public DateTime RequestedAt { get; set; }
    public string EventId { get; set; } = string.Empty;
    public string? AssignedWaiterUserId { get; set; }
    public DateTime? PickedUpAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public record CreateServiceRequestDto(string CustomerId, int RequestedGlassQuantity);
public record AssignWaiterDto(string WaiterUserId);
