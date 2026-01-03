using HallOfQuestions.Backend.Domain.Entities;
using HallOfQuestions.Backend.Domain.Repositories;
using Ydb.Sdk.Ado;
using Ydb.Sdk.Value;

namespace HallOfQuestions.Backend.Infrastructure.Repositories;

public class YdbQuestionRepository(YdbDataSource ydbDataSource) : YdbBaseRepository(ydbDataSource), IQuestionRepository
{
    private const string IdColumnName = "id";
    private const string ReportIdColumnName = "report_id";
    private const string ThemeColumnName = "theme";
    private const string TextColumnName = "text";
    private const string CreatedAtColumnName = "created_at";
    private const string LikesCountColumnName = "likes_count";
    
    public async Task AddAsync(Question question, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            INSERT INTO questions (
                                {IdColumnName},
                                {ReportIdColumnName},
                                {ThemeColumnName},
                                {TextColumnName},
                                {CreatedAtColumnName},
                                {LikesCountColumnName}
                            )
                            VALUES (
                                ${IdColumnName},
                                ${ReportIdColumnName},
                                ${ThemeColumnName},
                                ${TextColumnName},
                                ${CreatedAtColumnName},
                                ${LikesCountColumnName}
                            );
                            """;
        var parameters = GetQuestionParameters(question);
        await ExecuteNonQueryCommandAsync(sql, parameters: parameters, cancellationToken: cancellationToken);
    }

    public async Task<IEnumerable<Question>> GetAllForReportAsync(string reportId, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            SELECT
                                {IdColumnName},
                                {ReportIdColumnName},
                                {ThemeColumnName},
                                {TextColumnName},
                                {CreatedAtColumnName},
                                {LikesCountColumnName}
                            FROM questions
                            WHERE {ReportIdColumnName} = ${ReportIdColumnName}
                            """;
        var parameters = new Dictionary<string, YdbValue> { [$"${ReportIdColumnName}"] = YdbValue.MakeUtf8(reportId) };
        var questions = await ExecuteReaderCommandAsync(
            sql,
            async reader =>
            {
                var questions = new List<Question>();
                while (await reader.ReadAsync(cancellationToken))
                    questions.Add(GetQuestionFromReader(reader));
                return questions;
            },
            parameters: parameters,
            cancellationToken: cancellationToken);
        return questions;
    }

    public async Task<Question?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            SELECT
                                {IdColumnName},
                                {ReportIdColumnName},
                                {ThemeColumnName},
                                {TextColumnName},
                                {CreatedAtColumnName},
                                {LikesCountColumnName}
                            FROM questions
                            WHERE {IdColumnName} = ${IdColumnName}
                            """;
        var parameters = new Dictionary<string, YdbValue> { [$"${IdColumnName}"] = YdbValue.MakeUtf8(id) };
        var question = await ExecuteReaderCommandAsync(
            sql,
            async reader =>
            {
                if (!await reader.ReadAsync(cancellationToken))
                    return null;
                return GetQuestionFromReader(reader);
            },
            parameters: parameters,
            cancellationToken: cancellationToken);
        return question;
    }

    public async Task SaveChangesAsync(Question question, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
                            UPDATE questions
                            SET {IdColumnName} = ${IdColumnName},
                                {ReportIdColumnName} = ${ReportIdColumnName},
                                {ThemeColumnName} = ${ThemeColumnName},
                                {TextColumnName} = ${TextColumnName},
                                {CreatedAtColumnName} = ${CreatedAtColumnName},
                                {LikesCountColumnName} = ${LikesCountColumnName}
                            WHERE {IdColumnName} = ${IdColumnName}
                            """;
        var parameters = GetQuestionParameters(question);
        await ExecuteNonQueryCommandAsync(sql, parameters: parameters, cancellationToken: cancellationToken);
    }

    private static Dictionary<string, YdbValue> GetQuestionParameters(Question question) =>
        new()
        {
            [$"${IdColumnName}"] = YdbValue.MakeUtf8(question.Id),
            [$"${ReportIdColumnName}"] = YdbValue.MakeUtf8(question.ReportId),
            [$"${ThemeColumnName}"] = YdbValue.MakeUtf8(question.Theme),
            [$"${TextColumnName}"] = YdbValue.MakeUtf8(question.Theme),
            [$"${CreatedAtColumnName}"] = YdbValue.MakeDatetime(question.CreatedAt),
            [$"${LikesCountColumnName}"] = YdbValue.MakeInt32(question.LikesCount)
        };

    private static Question GetQuestionFromReader(YdbDataReader reader) =>
        Question.FromState(
            reader.GetFieldValue<string>(reader.GetOrdinal(IdColumnName)),
            reader.GetFieldValue<string>(reader.GetOrdinal(ReportIdColumnName)),
            reader.GetFieldValue<string>(reader.GetOrdinal(ThemeColumnName)),
            reader.GetFieldValue<string>(reader.GetOrdinal(TextColumnName)),
            reader.GetFieldValue<DateTime>(reader.GetOrdinal(CreatedAtColumnName)),
            reader.GetFieldValue<int>(reader.GetOrdinal(LikesCountColumnName)),
            isValidated: true);
}