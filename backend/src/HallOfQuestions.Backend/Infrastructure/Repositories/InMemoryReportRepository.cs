using System.Collections.Concurrent;
using HallOfQuestions.Backend.Domain.Entities;
using HallOfQuestions.Backend.Domain.Repositories;
using HallOfQuestions.Backend.Exceptions;

namespace HallOfQuestions.Backend.Infrastructure.Repositories;

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

    public Task SaveChangesAsync(Report _, CancellationToken cancellationToken = default) =>
        Task.CompletedTask;
}