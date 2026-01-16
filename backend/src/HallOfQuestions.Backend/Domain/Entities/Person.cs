using HallOfQuestions.Backend.Exceptions;

namespace HallOfQuestions.Backend.Domain.Entities;

public class Person
{
    public string Name { get; }
    public string Surname { get; }

    public Person(string name, string surname)
    {
        ValidateOrThrow("Имя", name);
        ValidateOrThrow("Фамилия", surname);
        Name = name;
        Surname = surname;
    }

    private void ValidateOrThrow(string paramName, string value)
    {
        if (value.Length == 0)
            throw new DomainException($"Поле \"{paramName}\" не может быть пустым");
        if (!char.IsUpper(value[0]) || !char.IsLetter(value[0]))
            throw new DomainException($"Поле \"{paramName}\" должно начинаться с заглавной буквы");
        
        for (var i = 1; i < value.Length; i++)
        {
            var @char = value[i];
            if (!char.IsLetter(@char))
                throw new DomainException($"Поле \"{paramName}\" должно состоять исключительно из букв");
            if (!char.IsLower(@char))
                throw new DomainException(
                    $"Поле \"{paramName}\" должно состоять исключительно из букв в нижнем регистре" +
                    $" (за исключением первой буквы)");
        }
    }
}