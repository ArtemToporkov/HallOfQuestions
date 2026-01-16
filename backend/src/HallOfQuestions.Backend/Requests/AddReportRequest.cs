using System.ComponentModel.DataAnnotations;
using HallOfQuestions.Backend.Validation;

namespace HallOfQuestions.Backend.Requests;

public class AddReportRequest
{
    [Required(ErrorMessage = "Название доклада является обязательным полем")]
    [MinLength(10, ErrorMessage = "Название доклада не может быть короче {1} символов")]
    [MaxLength(50, ErrorMessage = "Название доклада не может быть длиннее {1} символов")]
    public string? ReportTitle { get; init; }
    
    [Required(ErrorMessage = "Начало доклада является обязательным полем")]
    [UtcDateTime]
    public DateTime? ReportStartDateUtc { get; init; }
    
    [Required(ErrorMessage = "Конец доклада является обязательным полем")]
    [UtcDateTime]
    public DateTime? ReportEndDateUtc { get; init; }

    [Required(ErrorMessage = "Информация о спикере является обязательной")]
    public PersonRequest? Speaker { get; init; }
}