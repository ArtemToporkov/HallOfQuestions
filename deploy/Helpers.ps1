function Invoke-External {
    $exe = $args[0]
    $rest = $args[1..($args.Length - 1)]

    & $exe @rest

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Something went wrong" -ForegroundColor Red
        exit 1
    }
}