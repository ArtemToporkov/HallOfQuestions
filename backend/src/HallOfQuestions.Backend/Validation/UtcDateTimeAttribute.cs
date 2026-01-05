using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Validation;

public class UtcDateTimeAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext) =>
        value is DateTime { Kind: DateTimeKind.Utc } 
            ? ValidationResult.Success 
            : new ValidationResult("Date must be in UTC (e.g., ending with 'Z')");
}