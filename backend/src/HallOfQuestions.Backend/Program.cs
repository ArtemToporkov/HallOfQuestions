using HallOfQuestions.Backend.Domain.Entities;
using HallOfQuestions.Backend.Domain.Repositories;
using HallOfQuestions.Backend.ExceptionHandling;
using HallOfQuestions.Backend.Exceptions;
using HallOfQuestions.Backend.Extensions;
using HallOfQuestions.Backend.Infrastructure.Persistence;
using HallOfQuestions.Backend.Infrastructure.Repositories;
using HallOfQuestions.Backend.Requests;
using Microsoft.AspNetCore.Mvc;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddYdbDataSource(builder.Configuration, builder.Environment);
builder.Services.AddSingleton<YdbSchemaInitializer>();
builder.Services.AddScoped<IQuestionRepository, YdbQuestionRepository>();
builder.Services.AddScoped<IReportRepository, YdbReportRepository>();
builder.Services.AddValidation();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddOpenApi();

var app = builder.Build();

if (args.Contains("--init-ydb-endpoint-only"))
{
    app.MapPost("/api/init-ydb", async (
        [FromQuery] bool dropIfExist = false) =>
    {
        var scope = app.Services.CreateScope();
        var ydbSchemaInitializer = scope.ServiceProvider.GetRequiredService<YdbSchemaInitializer>();
        await ydbSchemaInitializer.InitializeAsync(
            dropIfExist: dropIfExist);
        return Results.Created();
    });
}
else
{
    var replicaId = $"{Environment.MachineName} (generated id from backend: {Guid.NewGuid()})";
    app.Use(async (context, next) =>
    {
        context.Response.Headers["X-Replica-ID"] = replicaId;
        await next();
    });

    app.UseExceptionHandler();

    app.UseHttpsRedirection();
    
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference();
    }

    app.MapGet("/api/reports", async (
        [FromServices] IReportRepository repository) =>
    {
        var reports = await repository.GetAllAsync();
        return reports;
    });

    app.MapPost("/api/reports", async (
        [FromBody] AddReportRequest request,
        [FromServices] IReportRepository repository) =>
    {
        var person = new Person(request.Speaker!.Name!, request.Speaker!.Surname!);
        var report = Report.PlanNew(
            Guid.NewGuid().ToString(),
            request.ReportTitle!,
            person,
            DateTime.UtcNow,
            request.ReportStartDateUtc!.Value,
            request.ReportEndDateUtc!.Value);
        await repository.AddAsync(report);
        return Results.Created($"/api/reports/{report.Id}", report);
    });

    app.MapPost("/api/reports/{id}/start", async (
        [FromRoute] string id,
        [FromServices] IReportRepository repository) =>
    {
        var report = await repository.GetByIdAsync(id);
        if (report is null)
            throw new NotFoundException("доклад", id);
        report.Start(DateTime.UtcNow);
        await repository.SaveChangesAsync(report);
        return report;
    });

    app.MapPost("/api/reports/{id}/end", async (
        [FromRoute] string id,
        [FromServices] IReportRepository repository) =>
    {
        var report = await repository.GetByIdAsync(id);
        if (report is null)
            throw new NotFoundException("доклад", id);
        report.End(DateTime.UtcNow);
        await repository.SaveChangesAsync(report);
        return report;
    });

    app.MapGet("/api/reports/{id}/questions", async (
        [FromRoute] string id,
        [FromServices] IQuestionRepository repository) =>
    {
        var questions = await repository.GetAllForReportAsync(id);
        return questions;
    });

    app.MapPost("/api/reports/{id}/questions", async (
        [FromRoute] string id,
        [FromBody] AddQuestionRequest request, 
        [FromServices] IQuestionRepository questionRepository, 
        [FromServices] IReportRepository reportRepository) =>
    {
        var report = await reportRepository.GetByIdAsync(id);
        if (report is null)
            throw new NotFoundException("доклад", id);
        var question = new Question(
            Guid.NewGuid().ToString(),
            id,
            request.QuestionTheme!,
            request.QuestionText!);
        await questionRepository.AddAsync(question);
        return Results.Created($"/api/reports/{id}/questions/{question.Id}", question);
    });

    app.MapPost("/api/reports/{reportId}/questions/{questionId}/like", async (
        [FromRoute] string reportId,
        [FromRoute] string questionId,
        [FromServices] IQuestionRepository repository) =>
    {
        var question = await repository.GetByIdAsync(questionId);
        if (question is null)
            throw new NotFoundException("вопрос", questionId);
        if (question.ReportId != reportId)
            throw new BadRequestException("Вопрос не относится к этому докладу");
        question.Like();
        await repository.SaveChangesAsync(question);
        return question;
    });

    app.MapPost("/api/reports/{reportId}/questions/{questionId}/unlike", async (
        [FromRoute] string reportId,
        [FromRoute] string questionId,
        [FromServices] IQuestionRepository repository) =>
    {
        var question = await repository.GetByIdAsync(questionId);
        if (question is null)
            throw new NotFoundException("вопрос", questionId);
        if (question.ReportId != reportId)
            throw new BadRequestException("Вопрос не относится к этому докладу");
        question.Unlike();
        await repository.SaveChangesAsync(question);
        return question;
    });
}

app.Run();