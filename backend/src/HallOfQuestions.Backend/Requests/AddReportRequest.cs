using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Requests;

public class AddReportRequest
{
    [Required]
    [MinLength(10)]
    [MaxLength(50)]
    public required string ReportTitle { get; init; }
    
    [Required]
    [DataType(DataType.DateTime)]
    public required DateTime ReportStartDateUtc { get; init; }
    
    [Required]
    [DataType(DataType.DateTime)]
    public required DateTime ReportEndDateUtc { get; init; }
    
    [Required]
    public required PersonRequest Speaker { get; init; }
}