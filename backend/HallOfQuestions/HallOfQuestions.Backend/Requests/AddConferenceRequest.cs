using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Requests;

public class AddConferenceRequest
{
    [Required]
    [MinLength(10)]
    [MaxLength(50)]
    public required string ConferenceName { get; init; }
    
    [Required]
    public required DateTime ConferenceStartDate { get; init; }
    
    [Required]
    public required DateTime ConferenceEndDate { get; init; }
}