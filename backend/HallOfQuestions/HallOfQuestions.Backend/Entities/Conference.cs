using HallOfQuestions.Backend.Enums;
using HallOfQuestions.Backend.Exceptions;

namespace HallOfQuestions.Backend.Entities;

public class Conference
{
    public string Id { get; }
    public string Name { get; }
    public DateTime ScheduledStartDate { get; }
    public DateTime ScheduledEndDate { get; }
    public DateTime? ActualStartDate { get; private set; }
    public DateTime? ActualEndDate { get; private set; }
    public ConferenceStatus Status { get; private set; }

    public Conference(string id, string name, DateTime scheduledStartDate, DateTime scheduledEndDate)
    {
        if (scheduledStartDate > scheduledEndDate)
            throw new DomainException("Scheduled start date can't be later than scheduled end date");
        
        Id = id;
        Name = name;
        ScheduledStartDate = scheduledStartDate;
        ScheduledEndDate = scheduledEndDate;
        ActualEndDate = null;
        Status = ConferenceStatus.NotStarted;
    }
    
    public void Start(DateTime startDate) =>
        Status = Status switch
        {
            ConferenceStatus.Started => throw new DomainException("Conference has already started"),
            ConferenceStatus.Ended => throw new DomainException("Conference has already ended"),
            ConferenceStatus.NotStarted => ConferenceStatus.Started,
            _ => throw new ArgumentException("Unexpected conference status")
        };

    public void End(DateTime endDate)
    {
        var newStatus = Status switch
        {
            ConferenceStatus.Started => ConferenceStatus.Ended,
            ConferenceStatus.Ended => throw new DomainException("Conference has already ended"),
            ConferenceStatus.NotStarted => throw new DomainException("Conference has not started"),
            _ => throw new ArgumentException("Unexpected conference status")
        };
        if (endDate > ActualStartDate!.Value)
            throw new DomainException("Conference can't end earlier than it started");

        Status = newStatus;
        ActualEndDate = endDate;
    }
}