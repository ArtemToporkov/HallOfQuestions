using System.Runtime.InteropServices;
using HallOfQuestions.Backend.Enums;

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

    public Conference(string id, string name, DateTime scheduledStartDate, DateTime scheduledEndDate, ConferenceStatus status)
    {
        ArgumentOutOfRangeException.ThrowIfGreaterThan(scheduledStartDate, scheduledEndDate);
        
        Id = id;
        Name = name;
        ScheduledStartDate = scheduledStartDate;
        ScheduledEndDate = scheduledEndDate;
        ActualEndDate = null;
        Status = status;
    }
    
    public void Start(DateTime startDate) =>
        Status = Status switch
        {
            ConferenceStatus.Started => throw new InvalidOperationException("Conference has already started"),
            ConferenceStatus.Ended => throw new InvalidOperationException("Conference has already ended"),
            ConferenceStatus.NotStarted => ConferenceStatus.Started,
            _ => throw new ArgumentException("Unexpected conference status")
        };

    public void End(DateTime endDate)
    {
        var newStatus = Status switch
        {
            ConferenceStatus.Started => ConferenceStatus.Ended,
            ConferenceStatus.Ended => throw new InvalidOperationException("Conference has already ended"),
            ConferenceStatus.NotStarted => throw new InvalidOperationException("Conference has not started"),
            _ => throw new ArgumentException("Unexpected conference status")
        };
        ArgumentOutOfRangeException.ThrowIfLessThan(endDate, ActualStartDate!.Value);

        Status = newStatus;
        ActualEndDate = endDate;
    }
}