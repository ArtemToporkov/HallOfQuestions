using HallOfQuestions.Backend.Exceptions;

namespace HallOfQuestions.Backend.Domain.Entities;

public class Person
{
    public string Name { get; }
    public string Surname { get; }

    public Person(string name, string surname)
    {
        ValidateOrThrow(nameof(Name), name);
        ValidateOrThrow(nameof(Surname), surname);
        Name = name;
        Surname = surname;
    }

    private void ValidateOrThrow(string paramName, string value)
    {
        if (value.Length == 0)
            throw new DomainException($"{paramName} cannot be empty");
        if (!char.IsUpper(value[0]) || !char.IsLetter(value[0]))
            throw new DomainException($"{paramName} must start with a capital letter");
        
        for (var i = 1; i < value.Length; i++)
        {
            var @char = value[i];
            if (!char.IsLetter(@char))
                throw new DomainException($"{paramName} must contain only letters");
            if (!char.IsLower(@char))
                throw new DomainException(
                    $"{paramName} must contain only lowercase letters except for the first letter");
        }
    }
}