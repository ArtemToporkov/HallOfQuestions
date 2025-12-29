using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Entities;

public class Question
{
    public string Id { get; }
    public string ConferenceId { get; }
    public string Theme { get; }
    public string Text { get; }
    public DateTime CreatedAt { get; }
    public int LikesCount { get; private set; }

    public Question(string id, string conferenceId, string theme, string text, DateTime createdAt)
    {
        Id = id;
        ConferenceId = conferenceId;
        Theme = theme;
        Text = text;
        CreatedAt = createdAt;
        LikesCount = 0;
    }

    public void Like() => LikesCount++;

    public void Unlike()
    {
        if (LikesCount == 0)
            throw new InvalidOperationException("Likes cannot be negative");
    }
}