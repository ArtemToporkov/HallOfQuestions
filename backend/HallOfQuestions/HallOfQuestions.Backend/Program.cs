using HallOfQuestions.Backend.Entities;
using HallOfQuestions.Backend.ExceptionHandling;
using HallOfQuestions.Backend.Exceptions;
using HallOfQuestions.Backend.Repositories.Abstractions;
using HallOfQuestions.Backend.Repositories.Implementations;
using HallOfQuestions.Backend.Requests;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IQuestionRepository, InMemoryQuestionRepository>();
builder.Services.AddSingleton<IConferenceRepository, InMemoryConferenceRepository>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseExceptionHandler();

app.MapGet("/api/conferences", async ([FromServices] IConferenceRepository repository) =>
{
    var conferences = await repository.GetAllAsync();
    return conferences;
});

app.MapPost("/api/conferences", async (
    [FromBody] AddConferenceRequest request,
    [FromServices] IConferenceRepository repository) =>
{
    var conference = new Conference(
        Guid.NewGuid().ToString(),
        request.ConferenceName,
        request.ConferenceStartDate,
        request.ConferenceEndDate);
    await repository.AddAsync(conference);
});

app.MapPost("/api/conferences/{id}/start", async (
    [FromRoute] string id,
    [FromServices] IConferenceRepository repository) =>
{
    var conference = await repository.GetByIdAsync(id);
    if (conference is null)
        throw new NotFoundException(nameof(Conference), id);
    conference.Start(DateTime.UtcNow);
});

app.MapPost("/api/conferences/{id}/end", async (
    [FromRoute] string id,
    [FromServices] IConferenceRepository repository) =>
{
    var conference = await repository.GetByIdAsync(id);
    if (conference is null)
        throw new NotFoundException(nameof(Conference), id);
    conference.End(DateTime.UtcNow);
});

app.MapGet("/api/conferences/{id}/questions", async (
    [FromRoute] string id,
    [FromServices] IQuestionRepository repository) =>
{
    var questions = await repository.GetAllForConferenceAsync(id);
    return Results.Ok(questions);
});

app.MapPost("/api/conferences/{id}/questions", async (
    [FromRoute] string id,
    [FromBody] AddQuestionRequest request, 
    [FromServices] IQuestionRepository questionRepository, 
    [FromServices] IConferenceRepository conferenceRepository) =>
{
    var conference = await conferenceRepository.GetByIdAsync(id);
    if (conference is null)
        throw new NotFoundException(nameof(Conference), id);
    var question = new Question(
        Guid.NewGuid().ToString(),
        id,
        request.QuestionTheme,
        request.QuestionText,
        DateTime.UtcNow);
    await questionRepository.AddAsync(question);
});

app.MapPost("/api/conferences/{conferenceId}/questions/{questionId}/like", async (
    [FromRoute] string conferenceId,
    [FromRoute] string questionId,
    [FromServices] IQuestionRepository repository) =>
{
    var question = await repository.GetByIdAsync(questionId);
    if (question is null)
        throw new NotFoundException(nameof(Question), questionId);
    if (question.ConferenceId != conferenceId)
        throw new BadRequestException("Question does not belong to this conference");
    question.Like();
});

app.Run();