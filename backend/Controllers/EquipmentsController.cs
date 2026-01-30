using Microsoft.AspNetCore.Mvc;
using ProWine.POC.API.Models;
using ProWine.POC.API.Services;

namespace ProWine.POC.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentsController : ControllerBase
{
    private readonly MockDataService _mockDataService;

    public EquipmentsController(MockDataService mockDataService)
    {
        _mockDataService = mockDataService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_mockDataService.Equipments);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var equipment = _mockDataService.Equipments.FirstOrDefault(e => e.Id == id);
        if (equipment == null)
            return NotFound();

        return Ok(equipment);
    }

    [HttpGet("customer/{customerId}")]
    public IActionResult GetByCustomerId(string customerId)
    {
        var equipments = _mockDataService.Equipments
            .Where(e => e.CurrentCustomerId == customerId)
            .ToList();
        return Ok(equipments);
    }

    [HttpPost("pickup")]
    public IActionResult PickupEquipment([FromBody] PickupEquipmentDto dto)
    {
        var equipment = _mockDataService.Equipments.FirstOrDefault(e => e.Id == dto.EquipmentId);
        if (equipment == null)
            return NotFound("Equipment not found");

        if (equipment.Status != "Available")
            return BadRequest("Equipment is not available");

        var customer = _mockDataService.Customers.FirstOrDefault(c => c.Id == dto.CustomerId);
        if (customer == null)
            return BadRequest("Customer not found");

        // Verifica saldo disponível
        if (equipment.Type == "Champagne" && customer.AvailableChampagneQuantity <= 0)
            return BadRequest("No champagne buckets available for this customer");

        if (equipment.Type == "Spittoon" && customer.AvailableSpittoonQuantity <= 0)
            return BadRequest("No spittoons available for this customer");

        // Registra retirada
        equipment.Status = "PickedUp";
        equipment.CurrentCustomerId = dto.CustomerId;
        equipment.PickupDate = DateTime.UtcNow;

        // Atualiza saldo do cliente
        if (equipment.Type == "Champagne")
        {
            customer.PickedUpChampagneQuantity++;
            customer.AvailableChampagneQuantity--;
        }
        else if (equipment.Type == "Spittoon")
        {
            customer.PickedUpSpittoonQuantity++;
            customer.AvailableSpittoonQuantity--;
        }

        _mockDataService.SaveData();

        return Ok(equipment);
    }

    [HttpPost("return")]
    public IActionResult ReturnEquipment([FromBody] ReturnEquipmentDto dto)
    {
        var equipment = _mockDataService.Equipments.FirstOrDefault(e => e.Id == dto.EquipmentId);
        if (equipment == null)
            return NotFound("Equipment not found");

        if (equipment.Status != "PickedUp")
            return BadRequest("Equipment is not currently picked up");

        var customer = _mockDataService.Customers.FirstOrDefault(c => c.Id == equipment.CurrentCustomerId);

        // Registra devolução
        equipment.Status = "Returned";
        equipment.ReturnDate = DateTime.UtcNow;

        // Atualiza saldo do cliente
        if (customer != null && equipment.Type == "Champagne")
        {
            customer.PickedUpChampagneQuantity--;
            customer.AvailableChampagneQuantity++;
        }
        else if (customer != null && equipment.Type == "Spittoon")
        {
            customer.PickedUpSpittoonQuantity--;
            customer.AvailableSpittoonQuantity++;
        }

        _mockDataService.SaveData();

        return Ok(new
        {
            equipment,
            message = "Equipment returned successfully"
        });
    }

    [HttpPost("generate")]
    public IActionResult GenerateEquipments([FromBody] GenerateEquipmentsDto dto)
    {
        var generatedEquipments = new List<Equipment>();

        for (int i = 0; i < dto.Quantity; i++)
        {
            var equipment = new Equipment
            {
                Id = $"equip-{Guid.NewGuid().ToString().Substring(0, 8)}",
                EquipmentNumber = $"{dto.Type.ToUpper()}-{_mockDataService.Equipments.Count + i + 1:D3}",
                Type = dto.Type,
                QRCode = $"QR-{dto.Type.ToUpper()}-{_mockDataService.Equipments.Count + i + 1:D3}",
                Status = "Available",
                EventId = dto.EventId
            };

            _mockDataService.Equipments.Add(equipment);
            generatedEquipments.Add(equipment);
        }

        _mockDataService.SaveData();

        return Ok(generatedEquipments);
    }

    [HttpDelete("clear-all")]
    public IActionResult ClearAllEquipments()
    {
        var count = _mockDataService.Equipments.Count;
        _mockDataService.Equipments.Clear();
        _mockDataService.SaveData();

        return Ok(new { message = $"{count} equipamentos removidos com sucesso" });
    }
}

public record GenerateEquipmentsDto(string Type, int Quantity, string EventId);
