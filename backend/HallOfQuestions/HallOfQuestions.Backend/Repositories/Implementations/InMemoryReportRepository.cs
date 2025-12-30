using System.Collections.Concurrent;
using HallOfQuestions.Backend.Entities;
using HallOfQuestions.Backend.Exceptions;
using HallOfQuestions.Backend.Repositories.Abstractions;

namespace HallOfQuestions.Backend.Repositories.Implementations;

public class InMemoryReportRepository : IReportRepository
{
    private readonly ConcurrentDictionary<string, Report> _reports = new();

    public Task AddAsync(Report report, CancellationToken cancellationToken = default)
    {
        if (!_reports.TryAdd(report.Id, report))
            throw new ConflictException("Report already exists");
        return Task.CompletedTask;
    }

    public Task<Report?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        _reports.TryGetValue(id, out var report);
        return Task.FromResult(report);
    }

    public Task<IEnumerable<Report>> GetAllAsync(CancellationToken cancellationToken = default) =>
        Task.FromResult(_reports.Values.AsEnumerable());

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        Task.CompletedTask;
}