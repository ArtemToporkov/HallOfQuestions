using HallOfQuestions.Backend.Domain.Entities;

namespace HallOfQuestions.Backend.Domain.Repositories;

public interface IReportRepository
{
    public Task AddAsync(Report report, CancellationToken cancellationToken = default);
    
    public Task<Report?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    
    public Task<IEnumerable<Report>> GetAllAsync(CancellationToken cancellationToken = default);
    
    public Task SaveChangesAsync(Report report, CancellationToken cancellationToken = default);
}