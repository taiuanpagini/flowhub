using System.Text.Json;
using FlowHub.API.Models;

namespace FlowHub.API.Services;

public class MockDataService
{
    private readonly string _dataFilePath;
    private MockData? _data;

    public MockDataService(IWebHostEnvironment env)
    {
        _dataFilePath = Path.Combine(env.ContentRootPath, "Data", "mock-data.json");
        LoadData();
    }

    private void LoadData()
    {
        try
        {
            var json = File.ReadAllText(_dataFilePath);
            _data = JsonSerializer.Deserialize<MockData>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading mock data: {ex.Message}");
            _data = new MockData();
        }
    }

    public List<User> Users => _data?.Users ?? new List<User>();
    public List<Customer> Customers => _data?.Customers ?? new List<Customer>();
    public List<Equipment> Equipments => _data?.Equipments ?? new List<Equipment>();
    public List<ServiceRequest> ServiceRequests => _data?.ServiceRequests ?? new List<ServiceRequest>();
    public List<Event> Events => _data?.Events ?? new List<Event>();

    public void SaveData()
    {
        try
        {
            var json = JsonSerializer.Serialize(_data, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            File.WriteAllText(_dataFilePath, json);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving mock data: {ex.Message}");
        }
    }
}

public class MockData
{
    public List<User> Users { get; set; } = new();
    public List<Customer> Customers { get; set; } = new();
    public List<Equipment> Equipments { get; set; } = new();
    public List<ServiceRequest> ServiceRequests { get; set; } = new();
    public List<Event> Events { get; set; } = new();
}
