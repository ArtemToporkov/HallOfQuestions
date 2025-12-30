using HallOfQuestions.Backend.Entities;

namespace HallOfQuestions.Backend.Repositories.Abstractions;

public interface IReportRepository
{
    public Task AddAsync(Report report, CancellationToken cancellationToken = default);
    
    public Task<Report?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    
    public Task<IEnumerable<Report>> GetAllAsync(CancellationToken cancellationToken = default);
    
    public Task SaveChangesAsync(CancellationToken cancellationToken = default);
}