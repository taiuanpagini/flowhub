namespace FlowHub.API.Models;

public class Customer
{
    public string Id { get; set; } = string.Empty;
    public string CNPJ { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string StandNumber { get; set; } = string.Empty;
    public int PurchasedKitsQuantity { get; set; }
    public int AvailableChampagneQuantity { get; set; }
    public int PickedUpChampagneQuantity { get; set; }
    public int AvailableSpittoonQuantity { get; set; }
    public int PickedUpSpittoonQuantity { get; set; }
    public string BadgeQRCode { get; set; } = string.Empty;
    public string QrCode => BadgeQRCode; // Alias para compatibilidade com frontend
    public string EventId { get; set; } = string.Empty;
}
