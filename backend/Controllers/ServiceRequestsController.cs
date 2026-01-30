using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using FlowHub.API.Models;
using FlowHub.API.Services;
using FlowHub.API.Hubs;

namespace FlowHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceRequestsController : ControllerBase
{
    private readonly MockDataService _mockDataService;
    private readonly IHubContext<FlowHubHub> _hubContext;

    public ServiceRequestsController(MockDataService mockDataService, IHubContext<FlowHubHub> hubContext)
    {
        _mockDataService = mockDataService;
        _hubContext = hubContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_mockDataService.ServiceRequests);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var request = _mockDataService.ServiceRequests.FirstOrDefault(r => r.Id == id);
        if (request == null)
            return NotFound();

        return Ok(request);
    }

    [HttpGet("customer/{customerId}")]
    public IActionResult GetByCustomerId(string customerId)
    {
        var requests = _mockDataService.ServiceRequests.Where(r => r.CustomerId == customerId).ToList();
        return Ok(requests);
    }

    [HttpGet("waiter/{waiterId}")]
    public IActionResult GetByWaiterId(string waiterId)
    {
        var requests = _mockDataService.ServiceRequests
            .Where(r => r.AssignedWaiterUserId == waiterId)
            .ToList();
        return Ok(requests);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceRequestDto dto)
    {
        var customer = _mockDataService.Customers.FirstOrDefault(c => c.Id == dto.CustomerId);
        if (customer == null)
            return BadRequest("Customer not found");

        var serviceRequest = new ServiceRequest
        {
            Id = $"sr-{Guid.NewGuid().ToString().Substring(0, 8)}",
            CustomerId = dto.CustomerId,
            StandNumber = customer.StandNumber,
            RequestedGlassQuantity = dto.RequestedGlassQuantity,
            Status = "Pending",
            RequestedAt = DateTime.UtcNow,
            EventId = customer.EventId
        };

        _mockDataService.ServiceRequests.Add(serviceRequest);
        _mockDataService.SaveData();

        // Notifica em tempo real via SignalR
        await _hubContext.Clients.All.SendAsync("NewServiceRequest", serviceRequest);

        return CreatedAtAction(nameof(GetById), new { id = serviceRequest.Id }, serviceRequest);
    }

    [HttpPost("{id}/assign")]
    public async Task<IActionResult> AssignWaiter(string id, [FromBody] AssignWaiterDto dto)
    {
        var request = _mockDataService.ServiceRequests.FirstOrDefault(r => r.Id == id);
        if (request == null)
            return NotFound();

        request.AssignedWaiterUserId = dto.WaiterUserId;
        request.Status = "InProgress";
        _mockDataService.SaveData();

        // Notifica garçom via SignalR
        await _hubContext.Clients.All.SendAsync("ServiceRequestAssigned", request);

        return Ok(request);
    }

    [HttpPost("{id}/pickup")]
    public async Task<IActionResult> MarkAsPickedUp(string id)
    {
        var request = _mockDataService.ServiceRequests.FirstOrDefault(r => r.Id == id);
        if (request == null)
            return NotFound();

        request.PickedUpAt = DateTime.UtcNow;
        _mockDataService.SaveData();

        // Notifica via SignalR
        await _hubContext.Clients.All.SendAsync("ServiceRequestUpdated", request);

        return Ok(request);
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> MarkAsCompleted(string id)
    {
        var request = _mockDataService.ServiceRequests.FirstOrDefault(r => r.Id == id);
        if (request == null)
            return NotFound();

        request.Status = "Completed";
        request.CompletedAt = DateTime.UtcNow;
        _mockDataService.SaveData();

        // Notifica cliente via SignalR
        await _hubContext.Clients.All.SendAsync("ServiceRequestCompleted", request);

        return Ok(request);
    }
}
