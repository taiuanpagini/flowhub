using Microsoft.AspNetCore.Mvc;
using FlowHub.API.Models;
using FlowHub.API.Services;

namespace FlowHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly MockDataService _mockDataService;

    public CustomersController(MockDataService mockDataService)
    {
        _mockDataService = mockDataService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_mockDataService.Customers);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var customer = _mockDataService.Customers.FirstOrDefault(c => c.Id == id);
        if (customer == null)
            return NotFound();

        return Ok(customer);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Customer customer)
    {
        customer.Id = $"cust-{Guid.NewGuid().ToString().Substring(0, 8)}";
        _mockDataService.Customers.Add(customer);
        _mockDataService.SaveData();

        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] Customer updatedCustomer)
    {
        var customer = _mockDataService.Customers.FirstOrDefault(c => c.Id == id);
        if (customer == null)
            return NotFound();

        customer.CNPJ = updatedCustomer.CNPJ;
        customer.CompanyName = updatedCustomer.CompanyName;
        customer.StandNumber = updatedCustomer.StandNumber;
        customer.PurchasedKitsQuantity = updatedCustomer.PurchasedKitsQuantity;

        _mockDataService.SaveData();

        return Ok(customer);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var customer = _mockDataService.Customers.FirstOrDefault(c => c.Id == id);
        if (customer == null)
            return NotFound();

        _mockDataService.Customers.Remove(customer);
        _mockDataService.SaveData();

        return NoContent();
    }

    [HttpPost("generate-mock")]
    public IActionResult GenerateMockCustomers()
    {
        var mockCustomers = new List<Customer>
        {
            new Customer
            {
                Id = $"cust-{Guid.NewGuid().ToString().Substring(0, 8)}",
                CNPJ = $"{new Random().Next(10000000, 99999999)}000{new Random().Next(100, 999)}",
                CompanyName = "Vinícola Exemplo 1",
                StandNumber = $"A{new Random().Next(100, 999)}",
                PurchasedKitsQuantity = 3,
                AvailableChampagneQuantity = 6,
                PickedUpChampagneQuantity = 0,
                AvailableSpittoonQuantity = 6,
                PickedUpSpittoonQuantity = 0,
                BadgeQRCode = $"BADGE-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                EventId = "evt-001"
            },
            new Customer
            {
                Id = $"cust-{Guid.NewGuid().ToString().Substring(0, 8)}",
                CNPJ = $"{new Random().Next(10000000, 99999999)}000{new Random().Next(100, 999)}",
                CompanyName = "Vinícola Exemplo 2",
                StandNumber = $"B{new Random().Next(100, 999)}",
                PurchasedKitsQuantity = 2,
                AvailableChampagneQuantity = 4,
                PickedUpChampagneQuantity = 0,
                AvailableSpittoonQuantity = 4,
                PickedUpSpittoonQuantity = 0,
                BadgeQRCode = $"BADGE-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                EventId = "evt-001"
            },
            new Customer
            {
                Id = $"cust-{Guid.NewGuid().ToString().Substring(0, 8)}",
                CNPJ = $"{new Random().Next(10000000, 99999999)}000{new Random().Next(100, 999)}",
                CompanyName = "Vinícola Exemplo 3",
                StandNumber = $"C{new Random().Next(100, 999)}",
                PurchasedKitsQuantity = 1,
                AvailableChampagneQuantity = 2,
                PickedUpChampagneQuantity = 0,
                AvailableSpittoonQuantity = 2,
                PickedUpSpittoonQuantity = 0,
                BadgeQRCode = $"BADGE-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                EventId = "evt-001"
            }
        };

        foreach (var customer in mockCustomers)
        {
            _mockDataService.Customers.Add(customer);
        }

        _mockDataService.SaveData();

        return Ok(mockCustomers);
    }

    [HttpDelete("clear-all")]
    public IActionResult ClearAllCustomers()
    {
        var count = _mockDataService.Customers.Count;
        _mockDataService.Customers.Clear();
        _mockDataService.SaveData();

        return Ok(new { message = $"{count} clientes removidos com sucesso" });
    }
}
