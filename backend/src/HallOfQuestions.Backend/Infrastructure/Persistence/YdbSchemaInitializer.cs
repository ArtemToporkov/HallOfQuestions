using Ydb.Sdk.Ado;

namespace HallOfQuestions.Backend.Infrastructure.Persistence;

public class YdbSchemaInitializer(YdbDataSource ydbDataSource, ILogger<YdbSchemaInitializer> logger)
{
    public async Task InitializeAsync(bool dropIfExist = false, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("YDB schema initialization started");
        if (dropIfExist)
            logger.LogWarning("Tables will be dropped if they exist");
        try
        {
            await using var command = ydbDataSource.CreateCommand();
            if (dropIfExist)
            {
                logger.LogWarning("Dropping tables...");
                command.CommandText = """
                                      DROP TABLE IF EXISTS questions;
                                      DROP TABLE IF EXISTS reports;
                                      """;
                await command.ExecuteNonQueryAsync(cancellationToken);
                logger.LogWarning("Tables dropped");
            }
            else
            logger.LogInformation("Creating tables if they don't exist...");
            command.CommandText = """
                                  CREATE TABLE IF NOT EXISTS reports (
                                      id Utf8 NOT NULL,
                                      title Utf8 NOT NULL,
                                      speaker_name Utf8 NOT NULL,
                                      speaker_surname Utf8 NOT NULL,
                                      scheduled_start_date Datetime NOT NULL,
                                      scheduled_end_date Datetime NOT NULL,
                                      actual_start_date Datetime,
                                      actual_end_date Datetime,
                                      status Utf8 NOT NULL,
                                      PRIMARY KEY (id)
                                  );

                                  CREATE TABLE IF NOT EXISTS questions (
                                      id Utf8 NOT NULL,
                                      report_id Utf8 NOT NULL,
                                      theme Utf8 NOT NULL,
                                      text Utf8 NOT NULL,
                                      created_at Datetime NOT NULL,
                                      likes_count Int32 NOT NULL,
                                      PRIMARY KEY (id),
                                      INDEX idx_questions_report_id GLOBAL ON (report_id)
                                  );
                                  """;
            await command.ExecuteNonQueryAsync(cancellationToken);
            logger.LogInformation("YDB schema initialization completed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initializing YDB schema");
            throw;
        }
    }
}