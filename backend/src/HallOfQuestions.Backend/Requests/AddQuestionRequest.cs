using System.ComponentModel.DataAnnotations;

namespace HallOfQuestions.Backend.Requests;

public class AddQuestionRequest
{
    [Required(ErrorMessage = "Тема вопроса является обязательным полем")]
    [MinLength(3, ErrorMessage = "Тема вопроса не может быть короче {1} символов")]
    [MaxLength(50, ErrorMessage = "Тема вопроса не может быть длиннее {1} символов")]
    public string? QuestionTheme { get; init; }

    [Required(ErrorMessage = "Текст вопроса является обязательным полем")]
    [MinLength(10, ErrorMessage = "Вопрос не может быть короче {1} символов")]
    [MaxLength(200, ErrorMessage = "Вопрос не может быть длиннее {1} символов")]
    public string? QuestionText { get; init; }
}