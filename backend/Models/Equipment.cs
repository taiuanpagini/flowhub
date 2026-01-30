namespace ProWine.POC.API.Models;

public class Equipment
{
    public string Id { get; set; } = string.Empty;
    public string EquipmentNumber { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Champagne, Spittoon
    public string QRCode { get; set; } = string.Empty;
    public string Status { get; set; } = "Available"; // Available, PickedUp, Returned
    public string EventId { get; set; } = string.Empty;
    public string? CurrentCustomerId { get; set; }
    public DateTime? PickupDate { get; set; }
    public DateTime? ReturnDate { get; set; }
}

public record PickupEquipmentDto(string CustomerId, string EquipmentId);
public record ReturnEquipmentDto(string EquipmentId);
