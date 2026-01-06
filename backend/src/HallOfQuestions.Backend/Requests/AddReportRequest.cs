using System.ComponentModel.DataAnnotations;
using HallOfQuestions.Backend.Validation;

namespace HallOfQuestions.Backend.Requests;

public class AddReportRequest
{
    [Required]
    [MinLength(10), MaxLength(50)]
    public string? ReportTitle { get; init; }
    
    [Required]
    [UtcDateTime]
    public DateTime? ReportStartDateUtc { get; init; }
    
    [Required]
    [UtcDateTime]
    public DateTime? ReportEndDateUtc { get; init; }

    [Required]
    public PersonRequest? Speaker { get; init; }
}