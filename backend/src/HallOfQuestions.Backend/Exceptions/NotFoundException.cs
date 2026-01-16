namespace HallOfQuestions.Backend.Exceptions;

public class NotFoundException(string entityName, string entityId) :
    Exception($"Не удалось найти {entityName} c ID {entityId}");