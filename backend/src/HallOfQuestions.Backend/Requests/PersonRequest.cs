using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Requests;

public class PersonRequest
{
    [Required]
    [MinLength(1), MaxLength(50)]
    public string? Name { get; init; }

    [Required]
    [MinLength(1), MaxLength(50)]
    public string? Surname { get; init; }
}