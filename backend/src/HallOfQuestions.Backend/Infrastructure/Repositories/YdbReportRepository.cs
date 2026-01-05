using HallOfQuestions.Backend.Domain.Entities;
using HallOfQuestions.Backend.Domain.Enums;
using HallOfQuestions.Backend.Domain.Repositories;
using Ydb.Sdk.Ado;
using Ydb.Sdk.Value;

namespace HallOfQuestions.Backend.Infrastructure.Repositories;

public class YdbReportRepository(YdbDataSource ydbDataSource) : YdbBaseRepository(ydbDataSource), IReportRepository
{
    private const string IdColumnName = "id";
    private const string TitleColumnName = "title";
    private const string SpeakerNameColumnName = "speaker_name";
    private const string SpeakerSurnameColumnName = "speaker_surname";
    private const string ScheduledStartDateUtcColumnName = "scheduled_start_date_utc";
    private const string ScheduledEndDateUtcColumnName = "scheduled_end_date_utc";
    private const string ActualStartDateUtcColumnName = "actual_start_date_utc";
    private const string ActualEndDateUtcColumnName = "actual_end_date_utc";
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
                                {ScheduledStartDateUtcColumnName},
                                {ScheduledEndDateUtcColumnName},
                                {ActualStartDateUtcColumnName},
                                {ActualEndDateUtcColumnName},
                                {StatusColumnName}
                            )
                            VAlUES (
                                ${IdColumnName},
                                ${TitleColumnName},
                                ${SpeakerNameColumnName},
                                ${SpeakerSurnameColumnName},
                                ${ScheduledStartDateUtcColumnName},
                                ${ScheduledEndDateUtcColumnName},
                                ${ActualStartDateUtcColumnName},
                                ${ActualEndDateUtcColumnName},
                                ${StatusColumnName}  
                            );
                            """;
        var parameters = GetReportParameters(report);
        await ExecuteNonQueryCommandAsync(sql, parameters: parameters, cancellationToken: cancellationToken);
    }

    public async Task<Report?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            SELECT
                                {IdColumnName},
                                {TitleColumnName},
                                {SpeakerNameColumnName},
                                {SpeakerSurnameColumnName},
                                {ScheduledStartDateUtcColumnName},
                                {ScheduledEndDateUtcColumnName},
                                {ActualStartDateUtcColumnName},
                                {ActualEndDateUtcColumnName},
                                {StatusColumnName}
                            FROM reports
                            WHERE {IdColumnName} = ${IdColumnName};
                            """;
        var parameters = new Dictionary<string, YdbValue> { [$"${IdColumnName}"] = YdbValue.MakeUtf8(id) };
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
                            SELECT
                                {IdColumnName},
                                {TitleColumnName},
                                {SpeakerNameColumnName},
                                {SpeakerSurnameColumnName},
                                {ScheduledStartDateUtcColumnName},
                                {ScheduledEndDateUtcColumnName},
                                {ActualStartDateUtcColumnName},
                                {ActualEndDateUtcColumnName},
                                {StatusColumnName}
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
                            SET {TitleColumnName} = ${TitleColumnName},
                                {SpeakerNameColumnName} = ${SpeakerNameColumnName},
                                {SpeakerSurnameColumnName} = ${SpeakerSurnameColumnName},
                                {ScheduledStartDateUtcColumnName} = ${ScheduledStartDateUtcColumnName},
                                {ScheduledEndDateUtcColumnName} = ${ScheduledEndDateUtcColumnName},
                                {ActualStartDateUtcColumnName} = ${ActualStartDateUtcColumnName},
                                {ActualEndDateUtcColumnName} = ${ActualEndDateUtcColumnName},
                                {StatusColumnName} = ${StatusColumnName}
                            WHERE {IdColumnName} = ${IdColumnName}
                            """;
        var parameters = GetReportParameters(report);
        await ExecuteNonQueryCommandAsync(sql, parameters: parameters, cancellationToken: cancellationToken);
    }

    private static Dictionary<string, YdbValue> GetReportParameters(Report report) =>
        new()
        {
            [$"${IdColumnName}"] = YdbValue.MakeUtf8(report.Id),
            [$"${TitleColumnName}"] = YdbValue.MakeUtf8(report.Title),
            [$"${SpeakerNameColumnName}"] = YdbValue.MakeUtf8(report.Speaker.Name),
            [$"${SpeakerSurnameColumnName}"] = YdbValue.MakeUtf8(report.Speaker.Surname),
            [$"${ScheduledStartDateUtcColumnName}"] = YdbValue.MakeDatetime(report.ScheduledStartDateUtc),
            [$"${ScheduledEndDateUtcColumnName}"] = YdbValue.MakeDatetime(report.ScheduledEndDateUtc),
            [$"${ActualStartDateUtcColumnName}"] = YdbValue.MakeOptionalDatetime(report.ActualStartDateUtc),
            [$"${ActualEndDateUtcColumnName}"] = YdbValue.MakeOptionalDatetime(report.ActualEndDateUtc),
            [$"${StatusColumnName}"] = YdbValue.MakeUtf8(MapReportStatusToString(report.Status))
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
            reader.GetFieldValue<DateTime>(reader.GetOrdinal(ScheduledStartDateUtcColumnName)),
            reader.GetFieldValue<DateTime>(reader.GetOrdinal(ScheduledEndDateUtcColumnName)),
            GetNullableFieldValueFromReader<DateTime>(reader, ActualStartDateUtcColumnName),
            GetNullableFieldValueFromReader<DateTime>(reader, ActualEndDateUtcColumnName),
            MapStringToReportStatus(reader.GetFieldValue<string>(reader.GetOrdinal(StatusColumnName))),
            isValidated: true);
    }

    private static T? GetNullableFieldValueFromReader<T>(YdbDataReader reader, string columnName) where T : struct
    {
        var ordinal = reader.GetOrdinal(columnName);
        return reader.IsDBNull(ordinal) 
            ? null 
            : reader.GetFieldValue<T>(ordinal);
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