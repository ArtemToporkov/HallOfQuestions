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
    public required DateTime ReportStartDate { get; init; }
    
    [Required]
    [DataType(DataType.DateTime)]
    public required DateTime ReportEndDate { get; init; }
}