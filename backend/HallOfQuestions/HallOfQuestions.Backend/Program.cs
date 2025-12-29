using HallOfQuestions.Backend.Requests;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
}

app.UseHttpsRedirection();

app.MapGet("/api/conferences", async () =>
{
});

app.MapPost("/api/conferences", async ([FromBody] AddConferenceRequest conference) =>
{
});

app.MapPost("/api/conferences/{id}/start", async ([FromRoute] string id) =>
{
});

app.MapPost("/api/conferences/{id}/end", async ([FromRoute] string id) =>
{
});

app.MapGet("/api/conferences/{id}/questions", async ([FromRoute] string id) =>
{
});

app.MapPost("/api/conferences/{id}/questions",
    async ([FromRoute] string conferenceId, [FromBody] AddQuestionRequest question) =>
    {
    });

app.MapPost("/api/conferences/{conferenceId}/questions/{questionId}/like",
    async ([FromRoute] string conferenceId, [FromRoute] string questionId) =>
    {
    });

app.Run();