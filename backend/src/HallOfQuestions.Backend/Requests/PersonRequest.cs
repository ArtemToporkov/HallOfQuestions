using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Requests;

public class PersonRequest
{
    [Required(ErrorMessage = "Имя человека является обязательным полем")]
    [MinLength(1, ErrorMessage = "Имя человека не может быть короче {1} символа")]
    [MaxLength(50, ErrorMessage = "Имя человека не может быть длиннее {1} символов")]
    public string? Name { get; init; }

    [Required(ErrorMessage = "Фамилия человека является обязательным полем")]
    [MinLength(1, ErrorMessage = "Фамилия человека не может быть короче {1} символа")]
    [MaxLength(50, ErrorMessage = "Фамилия человека не может быть длиннее {1} символов")]
    public string? Surname { get; init; }
}