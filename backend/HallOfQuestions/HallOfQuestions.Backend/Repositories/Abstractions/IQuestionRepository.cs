using HallOfQuestions.Backend.Entities;

namespace HallOfQuestions.Backend.Repositories.Abstractions;

public interface IQuestionRepository
{
    public Task AddAsync(Question question, CancellationToken cancellationToken = default);
    
    public Task<IEnumerable<Question>> GetAllForReportAsync(
        string reportId, CancellationToken cancellationToken = default);
    
    public Task<Question?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    
    public Task SaveChangesAsync(CancellationToken cancellationToken = default);
}