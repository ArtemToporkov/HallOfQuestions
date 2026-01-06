using System.Net;
using HallOfQuestions.Backend.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace HallOfQuestions.Backend.ExceptionHandling;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly Dictionary<Type, Func<Exception, HttpContext, CancellationToken, Task>> _handlers;
    
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (_handlers.TryGetValue(exception.GetType(), out var handler))
        {
            await handler(exception, httpContext, cancellationToken);
            return true;
        }

        await HandleExceptionAsync(
            (int)HttpStatusCode.InternalServerError,
            "Internal Server Error",
            "Something went wrong",
            httpContext,
            cancellationToken);
        return true;
    }
    
    public GlobalExceptionHandler() =>
        _handlers = new Dictionary<Type, Func<Exception, HttpContext, CancellationToken, Task>>
        {
            [typeof(ConflictException)] = (exception, context, token) =>
                HandleConflictExceptionAsync((ConflictException)exception, context, token),
            [typeof(DomainException)] = (exception, context, token) =>
                HandleDomainExceptionAsync((DomainException)exception, context, token),
            [typeof(NotFoundException)] = (exception, context, token) =>
                HandleNotFoundExceptionAsync((NotFoundException)exception, context, token),
            [typeof(BadRequestException)] = (exception, context, token) =>
                HandleBadRequestException((BadRequestException)exception, context, token)
        };
    
    private static async Task HandleConflictExceptionAsync(
        ConflictException exception,
        HttpContext httpContext,
        CancellationToken cancellationToken) =>
        await HandleExceptionAsync(
            (int)HttpStatusCode.Conflict,
            "Conflict",
            exception.Message,
            httpContext,
            cancellationToken);
    
    private static async Task HandleDomainExceptionAsync(
        DomainException exception,
        HttpContext httpContext,
        CancellationToken cancellationToken) =>
        await HandleExceptionAsync(
            (int)HttpStatusCode.BadRequest,
            "Bad Request",
            exception.Message,
            httpContext,
            cancellationToken);
    
    private static async Task HandleNotFoundExceptionAsync(
        NotFoundException exception,
        HttpContext httpContext,
        CancellationToken cancellationToken) =>
        await HandleExceptionAsync(
            (int)HttpStatusCode.NotFound,
            "Not Found",
            exception.Message,
            httpContext,
            cancellationToken);
    
    private static async Task HandleBadRequestException(
        BadRequestException exception,
        HttpContext httpContext,
        CancellationToken cancellationToken) =>
        await HandleExceptionAsync(
            (int)HttpStatusCode.BadRequest,
            "Bad Request",
            exception.Message,
            httpContext,
            cancellationToken);
    
    private static async Task HandleExceptionAsync(
        int statusCode,
        string title,
        string detail,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var problemDetails = new ProblemDetails
        {
            Title = title,
            Status = statusCode,
            Detail = detail
        };
        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
    }
}