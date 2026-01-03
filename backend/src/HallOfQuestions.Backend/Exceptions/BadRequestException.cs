namespace HallOfQuestions.Backend.Exceptions;

public class BadRequestException(string message) : Exception(message);