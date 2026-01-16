using HallOfQuestions.Backend.Domain.Enums;
using HallOfQuestions.Backend.Exceptions;

namespace HallOfQuestions.Backend.Domain.Entities;

public class Report
{
    public string Id { get; private init; }
    public string Title { get; private init; }
    public Person Speaker { get; private init; }
    public DateTime ScheduledStartDateUtc { get; private init; }
    public DateTime ScheduledEndDateUtc { get; private init; }
    public DateTime? ActualStartDateUtc { get; private set; }
    public DateTime? ActualEndDateUtc { get; private set; }
    public ReportStatus Status { get; private set; }

    public static Report PlanNew(
        string id,
        string title,
        Person speaker,
        DateTime nowUtc,
        DateTime scheduledStartDateUtc,
        DateTime scheduledEndDateUtc)
    {
        ValidateUtcOrThrow(scheduledStartDateUtc);
        ValidateUtcOrThrow(scheduledEndDateUtc);
        ValidateUtcOrThrow(nowUtc);
        
        if (scheduledStartDateUtc < nowUtc)
            throw new DomainException("Доклад не может быть запланирован ранее, чем текущее время UTC");
        if (scheduledStartDateUtc > scheduledEndDateUtc)
            throw new DomainException(
                "Запланированная дата начала доклада не может раньше его запланированной даты окончания");

        return new Report(
            id, title, speaker, scheduledStartDateUtc, scheduledEndDateUtc, null, null, ReportStatus.NotStarted);
    }

    public static Report FromState(
        string id,
        string title,
        Person speaker,
        DateTime scheduledStartDate,
        DateTime scheduledEndDate,
        DateTime? actualStartDate,
        DateTime? actualEndDate,
        ReportStatus status,
        bool isValidated = true)
    {
        if (!isValidated)
            throw new InvalidOperationException("State to initialize Report from should be validated");
        return new Report(
            id, title, speaker, scheduledStartDate, scheduledEndDate, actualStartDate, actualEndDate, status);
    }

    private Report(
        string id,
        string title,
        Person speaker,
        DateTime scheduledStartDateUtc,
        DateTime scheduledEndDateUtc,
        DateTime? actualStartDateUtc,
        DateTime? actualEndDateUtc,
        ReportStatus status)
    {
        Id = id;
        Title = title;
        Speaker = speaker;
        ScheduledStartDateUtc = scheduledStartDateUtc;
        ScheduledEndDateUtc = scheduledEndDateUtc;
        ActualStartDateUtc = actualStartDateUtc;
        ActualEndDateUtc = actualEndDateUtc;
        Status = status;
    }
    
    public void Start(DateTime startDateUtc)
    {
        ValidateUtcOrThrow(startDateUtc);
        
        ActualStartDateUtc = startDateUtc;
        Status = Status switch
        {
            ReportStatus.Started => throw new DomainException("Доклад уже начался"),
            ReportStatus.Ended => throw new DomainException("Доклад уже завершён"),
            ReportStatus.NotStarted => ReportStatus.Started,
            _ => throw new ArgumentException("Unexpected report status")
        };
    }

    public void End(DateTime endDate)
    {
        ValidateUtcOrThrow(endDate);
        
        var newStatus = Status switch
        {
            ReportStatus.Started => ReportStatus.Ended,
            ReportStatus.Ended => throw new DomainException("Доклад уже завершён"),
            ReportStatus.NotStarted => throw new DomainException("Доклад ещё не начался"),
            _ => throw new InvalidOperationException()
        };
        if (endDate < ActualStartDateUtc!.Value)
            throw new DomainException("Доклад не может закончиться раньше, чем начался");

        Status = newStatus;
        ActualEndDateUtc = endDate;
    }

    private static void ValidateUtcOrThrow(DateTime dateUtc)
    {
        if (dateUtc.Kind != DateTimeKind.Utc)
            throw new DomainException("Дата должна быть в UTC формате");
    }
}