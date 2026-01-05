using System.ComponentModel.DataAnnotations;
using HallOfQuestions.Backend.Validation;

namespace HallOfQuestions.Backend.Requests;

public class AddReportRequest
{
    [Required]
    [MinLength(10)]
    [MaxLength(50)]
    public required string ReportTitle { get; init; }
    
    [Required]
    [UtcDateTime]
    public required DateTime ReportStartDateUtc { get; init; }
    
    [Required]
    [UtcDateTime]
    public required DateTime ReportEndDateUtc { get; init; }
    
    [Required]
    public required PersonRequest Speaker { get; init; }
}