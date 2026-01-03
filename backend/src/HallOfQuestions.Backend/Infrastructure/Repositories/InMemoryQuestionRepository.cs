using System.Collections.Concurrent;
using HallOfQuestions.Backend.Domain.Entities;
using HallOfQuestions.Backend.Domain.Repositories;
using HallOfQuestions.Backend.Exceptions;

namespace HallOfQuestions.Backend.Infrastructure.Repositories;

public class InMemoryQuestionRepository : IQuestionRepository
{
    private readonly ConcurrentDictionary<string, Question> _questions = new();

    public Task AddAsync(Question question, CancellationToken cancellationToken = default)
    {
        if (!_questions.TryAdd(question.Id, question))
            throw new ConflictException("Question already exists");
        return Task.CompletedTask;
    }

    public Task<IEnumerable<Question>> GetAllForReportAsync(string reportId,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(
            _questions
                .Values
                .Where(q => q.ReportId == reportId));

    public Task<Question?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        _questions.TryGetValue(id, out var question);
        return Task.FromResult(question);
    }

    public Task SaveChangesAsync(Question _, CancellationToken cancellationToken = default) => Task.CompletedTask;
}