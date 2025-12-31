using HallOfQuestions.Backend.Enums;
using HallOfQuestions.Backend.Exceptions;

namespace HallOfQuestions.Backend.Entities;

public class Report
{
    public string Id { get; }
    public string Title { get; }
    public Person Speaker { get; }
    public DateTime ScheduledStartDate { get; }
    public DateTime ScheduledEndDate { get; }
    public DateTime? ActualStartDate { get; private set; }
    public DateTime? ActualEndDate { get; private set; }
    public ReportStatus Status { get; private set; }

    public Report(string id, string title, Person speaker, DateTime scheduledStartDate, DateTime scheduledEndDate)
    {
        if (scheduledStartDate > scheduledEndDate)
            throw new DomainException("Scheduled start date can't be later than scheduled end date");
        
        Id = id;
        Title = title;
        Speaker = speaker;
        ScheduledStartDate = scheduledStartDate;
        ScheduledEndDate = scheduledEndDate;
        ActualEndDate = null;
        Status = ReportStatus.NotStarted;
    }
    
    public void Start(DateTime startDate)
    {
        ActualStartDate = startDate;
        Status = Status switch
        {
            ReportStatus.Started => throw new DomainException("Report has already started"),
            ReportStatus.Ended => throw new DomainException("Report has already ended"),
            ReportStatus.NotStarted => ReportStatus.Started,
            _ => throw new ArgumentException("Unexpected report status")
        };
    }

    public void End(DateTime endDate)
    {
        var newStatus = Status switch
        {
            ReportStatus.Started => ReportStatus.Ended,
            ReportStatus.Ended => throw new DomainException("Report has already ended"),
            ReportStatus.NotStarted => throw new DomainException("Report has not started"),
            _ => throw new ArgumentException("Unexpected report status")
        };
        if (endDate < ActualStartDate!.Value)
            throw new DomainException("Report can't end earlier than it started");

        Status = newStatus;
        ActualEndDate = endDate;
    }
}