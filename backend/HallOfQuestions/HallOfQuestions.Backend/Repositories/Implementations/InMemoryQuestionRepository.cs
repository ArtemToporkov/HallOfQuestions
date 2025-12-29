using HallOfQuestions.Backend.Entities;
using HallOfQuestions.Backend.Repositories.Abstractions;

namespace HallOfQuestions.Backend.Repositories.Implementations;

public class InMemoryQuestionRepository : IQuestionRepository
{
    private readonly Dictionary<string, Question> _questions = new();

    public Task AddAsync(Question question, CancellationToken cancellationToken = default)
    {
        if (!_questions.TryAdd(question.Id, question))
            throw new InvalidOperationException("Question already exists");
        return Task.CompletedTask;
    }

    public Task<IEnumerable<Question>> GetAllForConferenceAsync(string conferenceId,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(
            _questions
                .Values
                .Where(q => q.ConferenceId == conferenceId));

    public Task<Question?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        _questions.TryGetValue(id, out var question);
        return Task.FromResult(question);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;
}