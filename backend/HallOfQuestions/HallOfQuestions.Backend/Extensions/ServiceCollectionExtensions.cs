using Ydb.Sdk.Ado;
using Ydb.Sdk.Auth;
using Ydb.Sdk.Yc;

namespace HallOfQuestions.Backend.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddYdbDataSource(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Ydb") ??
                               throw new ArgumentException("Missing \"Ydb\" connection string in configuration");
        var saFilePath = Path.Combine(AppContext.BaseDirectory, "sa-key.json");
        ICredentialsProvider credentialsProvider;
        if (File.Exists(saFilePath))
            credentialsProvider = new ServiceAccountProvider(saFilePath: saFilePath);
        else
            credentialsProvider = new MetadataProvider();
        
        var ydbConnectionBuilder = new YdbConnectionStringBuilder
        {
            ConnectionString = connectionString,
            UseTls = true,
            CredentialsProvider = credentialsProvider
        };
    
        var ydbDataSource = new YdbDataSource(ydbConnectionBuilder);
        services.AddSingleton(ydbDataSource);
    }
}