using HallOfQuestions.Backend.Entities;

namespace HallOfQuestions.Backend.Repositories.Abstractions;

public interface IConferenceRepository
{
    public Task AddAsync(Conference conference, CancellationToken cancellationToken = default);
    
    public Task<IEnumerable<Conference>> GetAllAsync(CancellationToken cancellationToken = default);
    
    public Task SaveChangesAsync(CancellationToken cancellationToken = default);
}