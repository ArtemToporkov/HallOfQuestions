using Ydb.Sdk.Ado;
using Ydb.Sdk.Value;

namespace HallOfQuestions.Backend.Infrastructure.Repositories;

public abstract class YdbBaseRepository(YdbDataSource ydbDataSource)
{
    protected async Task ExecuteNonQueryCommandAsync(
        string sql,
        Dictionary<string, YdbValue>? parameters = null,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await ydbDataSource.OpenConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = sql;
        if (parameters is not null)
            foreach (var (parameter, value) in parameters)
                command.Parameters.AddWithValue(parameter, value);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    protected async Task<TResult> ExecuteReaderCommandAsync<TResult>(
        string sql,
        Func<YdbDataReader, Task<TResult>> resultFromReaderFactory,
        Dictionary<string, YdbValue>? parameters = null,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await ydbDataSource.OpenConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = sql;
        if (parameters is not null)
            foreach (var (parameter, value) in parameters)
                command.Parameters.AddWithValue(parameter, value);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        return await resultFromReaderFactory(reader);
    }
}