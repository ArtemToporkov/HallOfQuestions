using HallOfQuestions.Backend.Exceptions;

namespace HallOfQuestions.Backend.Domain.Entities;

public class Question
{
    public string Id { get; }
    public string ReportId { get; }
    public string Theme { get; }
    public string Text { get; }
    public DateTime CreatedAt { get; }
    public int LikesCount { get; private set; }

    public Question(string id, string reportId, string theme, string text, DateTime createdAt)
    {
        Id = id;
        ReportId = reportId;
        Theme = theme;
        Text = text;
        CreatedAt = createdAt;
        LikesCount = 0;
    }

    public static Question FromState(
        string id,
        string reportId,
        string theme,
        string text,
        DateTime createdAt,
        int likesCount,
        bool isValidated = true) =>
        !isValidated
            ? throw new InvalidOperationException("State to initialize Question from should be validated")
            : new Question(id, reportId, theme, text, createdAt) { LikesCount = likesCount };

    public void Like() => LikesCount++;

    public void Unlike()
    {
        if (LikesCount == 0)
            throw new DomainException("Likes count cannot be negative");
        LikesCount--;
    }
}