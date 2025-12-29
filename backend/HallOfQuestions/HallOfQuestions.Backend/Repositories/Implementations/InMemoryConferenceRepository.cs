using HallOfQuestions.Backend.Entities;
using HallOfQuestions.Backend.Repositories.Abstractions;

namespace HallOfQuestions.Backend.Repositories.Implementations;

public class InMemoryConferenceRepository : IConferenceRepository
{
    private readonly Dictionary<string, Conference> _conferences = new();

    public Task AddAsync(Conference conference, CancellationToken cancellationToken = default)
    {
        if (!_conferences.TryAdd(conference.Id, conference))
            throw new InvalidOperationException("Conference already exists");
        return Task.CompletedTask;
    }

    public Task<IEnumerable<Conference>> GetAllAsync(CancellationToken cancellationToken = default) =>
        Task.FromResult(_conferences.Values.AsEnumerable());

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        Task.CompletedTask;
}