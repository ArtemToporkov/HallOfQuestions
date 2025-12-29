using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Requests;

public class AddQuestionRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(50)]
    public required string Theme { get; init; }
    
    [Required]
    [MinLength(10)]
    [MaxLength(200)]
    public required string Text { get; init; }
}