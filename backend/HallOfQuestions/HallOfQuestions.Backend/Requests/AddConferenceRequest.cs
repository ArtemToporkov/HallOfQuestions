using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Requests;

public class AddConferenceRequest
{
    [Required]
    [MinLength(10)]
    [MaxLength(50)]
    public required string Name { get; init; }
    
    [Required]
    public required DateTime StartDate { get; init; }
    
    [Required]
    public required DateTime EndDate { get; init; }
}