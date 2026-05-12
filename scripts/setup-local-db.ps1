# ============================================================
# setup-local-db.ps1
# Creates rakshaai_user and rakshaai_dev database on your
# local PostgreSQL 18. Run this ONCE before starting the app.
# ============================================================

$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

if (-not (Test-Path $psql)) {
    # Fallback to PostgreSQL 13
    $psql = "C:\Program Files\PostgreSQL\13\bin\psql.exe"
}

if (-not (Test-Path $psql)) {
    Write-Error "psql.exe not found. Ensure PostgreSQL is installed."
    exit 1
}

Write-Host ""
Write-Host "=========================================="
Write-Host "  RakshaAI Local Database Setup"
Write-Host "=========================================="
Write-Host "This will create:"
Write-Host "  - User:     rakshaai_user"
Write-Host "  - Password: Raksha@Dev2024"
Write-Host "  - Database: rakshaai_dev"
Write-Host ""
Write-Host "Enter your postgres superuser password when prompted."
Write-Host ""

$sql = @"
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'rakshaai_user') THEN
    CREATE ROLE rakshaai_user WITH LOGIN PASSWORD 'Raksha@Dev2024';
    RAISE NOTICE 'Created user rakshaai_user';
  ELSE
    ALTER ROLE rakshaai_user WITH PASSWORD 'Raksha@Dev2024';
    RAISE NOTICE 'Updated password for rakshaai_user';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE rakshaai_dev OWNER rakshaai_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rakshaai_dev')\gexec

GRANT ALL PRIVILEGES ON DATABASE rakshaai_dev TO rakshaai_user;
"@

$sql | & $psql -U postgres

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Database setup complete!" -ForegroundColor Green
    Write-Host "You can now run 'npx prisma migrate dev' or 'npm run db:push' from apps/backend."
} else {
    Write-Host ""
    Write-Host "FAILED: Check the error above." -ForegroundColor Red
}
