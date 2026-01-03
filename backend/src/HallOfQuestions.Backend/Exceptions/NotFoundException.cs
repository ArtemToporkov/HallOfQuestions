namespace HallOfQuestions.Backend.Exceptions;

public class NotFoundException(string entityName, string entityId) :
    Exception($"{entityName} with ID {entityId} not found");