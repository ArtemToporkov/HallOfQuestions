using HallOfQuestions.Backend.Domain.Entities;
using HallOfQuestions.Backend.Domain.Enums;
using HallOfQuestions.Backend.Domain.Repositories;
using Ydb.Sdk.Ado;

namespace HallOfQuestions.Backend.Infrastructure.Repositories;

public class YdbReportRepository(YdbDataSource ydbDataSource) : YdbBaseRepository(ydbDataSource), IReportRepository
{
    private const string IdColumnName = "id";
    private const string TitleColumnName = "title";
    private const string SpeakerNameColumnName = "speaker_name";
    private const string SpeakerSurnameColumnName = "speaker_surname";
    private const string ScheduledStartDateColumnName = "scheduled_start_date";
    private const string ScheduledEndDateColumnName = "scheduled_end_date";
    private const string ActualStartDateColumnName = "actual_start_date";
    private const string ActualEndDateColumnName = "actual_end_date";
    private const string StatusColumnName = "status";
    
    private const string StartedColumnValue = "started";
    private const string NotStartedColumnValue = "not started";
    private const string EndedColumnValue = "ended";
    
    public async Task AddAsync(Report report, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            INSERT INTO reports (
                                {IdColumnName},
                                {TitleColumnName},
                                {SpeakerNameColumnName},
                                {SpeakerSurnameColumnName},
                                {ScheduledStartDateColumnName},
                                {ScheduledEndDateColumnName},
                                {ActualStartDateColumnName},
                                {ActualEndDateColumnName},
                                {StatusColumnName}
                            )
                            VAlUES (
                                ${IdColumnName},
                                ${TitleColumnName},
                                ${SpeakerNameColumnName},
                                ${SpeakerSurnameColumnName},
                                ${ScheduledStartDateColumnName},
                                ${ScheduledEndDateColumnName},
                                ${ActualStartDateColumnName},
                                ${ActualEndDateColumnName},
                                ${StatusColumnName}  
                            );
                            """;
        var parameters = GetReportParameters(report);
        await ExecuteNonQueryCommandAsync(sql, parameters: parameters, cancellationToken: cancellationToken);
    }

    public async Task<Report?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            SELECT (
                                {IdColumnName},
                                {TitleColumnName},
                                {SpeakerNameColumnName},
                                {SpeakerSurnameColumnName},
                                {ScheduledStartDateColumnName},
                                {ScheduledEndDateColumnName},
                                {ActualStartDateColumnName},
                                {ActualEndDateColumnName},
                                {StatusColumnName}
                            )
                            FROM reports
                            WHERE {IdColumnName} = ${IdColumnName};
                            """;
        var parameters = new Dictionary<string, object> { [$"${IdColumnName}"] = id };
        var report = await ExecuteReaderCommandAsync(
            sql,
            async reader =>
            {
                if (!await reader.ReadAsync(cancellationToken))
                    return null;
                return GetReportFromReader(reader);
            },
            parameters: parameters,
            cancellationToken: cancellationToken);
        return report;
    }

    public async Task<IEnumerable<Report>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            SELECT (
                                {IdColumnName},
                                {TitleColumnName},
                                {SpeakerNameColumnName},
                                {SpeakerSurnameColumnName},
                                {ScheduledStartDateColumnName},
                                {ScheduledEndDateColumnName},
                                {ActualStartDateColumnName},
                                {ActualEndDateColumnName},
                                {StatusColumnName}
                            )
                            FROM reports;
                            """;
        var reports = await ExecuteReaderCommandAsync(
            sql,
            async reader =>
            {
                var reports = new List<Report>();
                while (await reader.ReadAsync(cancellationToken))
                    reports.Add(GetReportFromReader(reader));
                return reports;
            },
            cancellationToken: cancellationToken);
        return reports;
    }

    public async Task SaveChangesAsync(Report report, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            UPDATE reports
                            SET {IdColumnName} = ${IdColumnName},
                                {TitleColumnName} = ${TitleColumnName},
                                {SpeakerNameColumnName} = ${SpeakerNameColumnName},
                                {SpeakerSurnameColumnName} = ${SpeakerSurnameColumnName},
                                {ScheduledStartDateColumnName} = ${ScheduledStartDateColumnName},
                                {ScheduledEndDateColumnName} = ${ScheduledEndDateColumnName},
                                {ActualStartDateColumnName} = ${ActualEndDateColumnName},
                                {ActualEndDateColumnName} = ${ActualEndDateColumnName},
                                {StatusColumnName} = ${StatusColumnName}
                            """;
        var parameters = GetReportParameters(report);
        await ExecuteNonQueryCommandAsync(sql, parameters: parameters, cancellationToken: cancellationToken);
    }

    private static Dictionary<string, object> GetReportParameters(Report report) =>
        new()
        {
            [IdColumnName] = report.Id,
            [TitleColumnName] = report.Title,
            [SpeakerNameColumnName] = report.Speaker.Name,
            [SpeakerSurnameColumnName] = report.Speaker.Surname,
            [ScheduledStartDateColumnName] = report.ScheduledStartDate,
            [ScheduledEndDateColumnName] = report.ScheduledEndDate,
            [ActualStartDateColumnName] = report.ActualStartDate ?? (object)"null",
            [ActualEndDateColumnName] = report.ActualEndDate ?? (object)"null",
            [StatusColumnName] = report.Status
        };

    private static Report GetReportFromReader(YdbDataReader reader)
    {
        var speaker = new Person(
            reader.GetFieldValue<string>(reader.GetOrdinal(SpeakerNameColumnName)),
            reader.GetFieldValue<string>(reader.GetOrdinal(SpeakerSurnameColumnName))
        );
        return Report.FromState(
            reader.GetFieldValue<string>(reader.GetOrdinal(IdColumnName)),
            reader.GetFieldValue<string>(reader.GetOrdinal(TitleColumnName)),
            speaker,
            reader.GetFieldValue<DateTime>(reader.GetOrdinal(ScheduledStartDateColumnName)),
            reader.GetFieldValue<DateTime>(reader.GetOrdinal(ScheduledEndDateColumnName)),
            reader.GetFieldValue<DateTime?>(reader.GetOrdinal(ActualStartDateColumnName)),
            reader.GetFieldValue<DateTime?>(reader.GetOrdinal(ActualEndDateColumnName)),
            MapStringToReportStatus(reader.GetFieldValue<string>(reader.GetOrdinal(StatusColumnName))),
            isValidated: true);
    }

    private static string MapReportStatusToString(ReportStatus reportStatus) => reportStatus switch
    {
        ReportStatus.Started => StartedColumnValue,
        ReportStatus.NotStarted => NotStartedColumnValue,
        ReportStatus.Ended => EndedColumnValue,
        _ => throw new ArgumentOutOfRangeException(nameof(reportStatus), reportStatus, null)
    };

    private static ReportStatus MapStringToReportStatus(string reportStatus) => reportStatus switch
    {
        StartedColumnValue => ReportStatus.Started,
        NotStartedColumnValue => ReportStatus.NotStarted,
        EndedColumnValue => ReportStatus.Ended,
        _ => throw new ArgumentOutOfRangeException(nameof(reportStatus), reportStatus, null)
    };
}