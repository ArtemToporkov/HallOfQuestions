param (
    [switch]$DropIfExist
)

. "$PSScriptRoot/Helpers.ps1"

$ErrorActionPreference = "Stop"

$YANDEX_CLOUD_FOLDER_ID = "b1g4gkkorau936jmpgi4"
$YANDEX_CLOUD_SERVICE_ACCOUNT_ID = "ajeevkq231jhcfteppn5"
$YANDEX_CONTAINER_REGISTRY_ID = "crp7hsh5d124hgv5f4bg"

$INITIALIZER_YANDEX_CLOUD_SERVERLESS_CONTAINER_NAME = "hall-of-questions-ydb-initializer" 

$BACKEND_IMAGE = "cr.yandex/${YANDEX_CONTAINER_REGISTRY_ID}/hall-of-questions-backend:latest"
$BACKEND_INIT_YDB_ENDPOINT = "api/init-ydb"
$BACKEND_INIT_YDB_ENDPOINT_DROP_IF_EXIST_QUERY_PARAMETER = "dropIfExist"

$DOTNET_BACKEND_ENTRY_POINT_FILE = "HallOfQuestions.Backend.dll"
$DOTNET_MAP_INIT_YDB_ENDPOINT_ONLY_FLAG = "--init-ydb-endpoint-only"
$ASPNET_YDB_CONNECTION_STRING_ENV_VARIABLE = "ConnectionStrings__Ydb"
$YDB_CONNECTION_STRING = "Host=ydb.serverless.yandexcloud.net;Port=2135;Database=/ru-central1/b1galbfevin8h0bc0nht/etnouu3n4m119s1r2ajt"

Write-Host (
    "Ensure the backend image is pushed to Yandex Container Registry. " +
    "If not, run 'Publish-Backend.ps1' first"
) -ForegroundColor Yellow
Write-Host "Creating serverless initializer container if doesn't exist..."
$containerExists = Invoke-External yc serverless container list `
    --folder-id $YANDEX_CLOUD_FOLDER_ID `
    --format json `
    | ConvertFrom-Json `
    | Where-Object { $_.name -eq $INITIALIZER_YANDEX_CLOUD_SERVERLESS_CONTAINER_NAME }    
if (-not $containerExists) {
    Invoke-External yc serverless container create `
        --name $INITIALIZER_YANDEX_CLOUD_SERVERLESS_CONTAINER_NAME `
        --folder-id $YANDEX_CLOUD_FOLDER_ID
}

Write-Host "Deploying serverless initializer container revision..."
Invoke-External yc serverless container revision deploy `
    --container-name $INITIALIZER_YANDEX_CLOUD_SERVERLESS_CONTAINER_NAME `
    --image $BACKEND_IMAGE `
    --cores 1 `
    --memory 1024MB `
    --service-account-id $YANDEX_CLOUD_SERVICE_ACCOUNT_ID `
    --folder-id $YANDEX_CLOUD_FOLDER_ID `
    --environment "${ASPNET_YDB_CONNECTION_STRING_ENV_VARIABLE}=${YDB_CONNECTION_STRING}" `
    --command dotnet `
    --args $DOTNET_BACKEND_ENTRY_POINT_FILE `
    --args $DOTNET_MAP_INIT_YDB_ENDPOINT_ONLY_FLAG
       
Write-Host "Allowing unauthenticated serverless container invokes..." -ForegroundColor Yellow
Invoke-External yc serverless container allow-unauthenticated-invoke `
    --name $INITIALIZER_YANDEX_CLOUD_SERVERLESS_CONTAINER_NAME `
    --folder-id $YANDEX_CLOUD_FOLDER_ID
    
Write-Host "Triggering YDB initializer container using HTTP request..."
$uri = Invoke-External yc serverless container get `
    --folder-id $YANDEX_CLOUD_FOLDER_ID `
    --name $INITIALIZER_YANDEX_CLOUD_SERVERLESS_CONTAINER_NAME `
    --format json `
    | ConvertFrom-Json `
    | Select-Object `
    -ExpandProperty url

$uri = "${uri}${BACKEND_INIT_YDB_ENDPOINT}"
if ($DropIfExist) {
    $uri = $uri + "?${BACKEND_INIT_YDB_ENDPOINT_DROP_IF_EXIST_QUERY_PARAMETER}=True"
}
Invoke-RestMethod -Uri "${uri}" -Method Post

Write-Host "Done" -ForegroundColor Green